/* eslint-disable @typescript-eslint/no-require-imports -- Isolated TypeScript test loader. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { randomUUID } = require("node:crypto");
const url = new URL(process.env.PACKAGE_TEST_DATABASE_URL);
assert.equal(url.hostname, "127.0.0.1");
assert.equal(url.username, "ezra_checkout");
assert.equal(url.pathname, "/ezra_package_test");
process.env.DATABASE_URL = url.href;
Object.assign(process.env, { DEMO_SESSION_SECRET: randomUUID(), DEMO_PRESENTER_KEY: randomUUID(),
  DEMO_APP_ORIGIN: "http://localhost:3000", PAYPAL_ENV: "sandbox", PAYPAL_CLIENT_ID: "mock", PAYPAL_CLIENT_SECRET: "mock" });
const cookieJar = new Map();
const original = Module._load;
Module._load = function(name, ...args) {
  if (name === "server-only") return {};
  if (name === "next/headers") return { cookies: async () => ({
    get: key => cookieJar.has(key) ? { value: cookieJar.get(key) } : undefined,
    set: (key, value) => cookieJar.set(key, value)
  }) };
  return original.call(this, name.startsWith("@/") ? path.resolve(__dirname, "..", name.slice(2)) : name, ...args);
};
require.extensions[".ts"] = (mod,file) => mod._compile(ts.transpileModule(fs.readFileSync(file,"utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 }
}).outputText,file);
const { POST } = require("../app/api/packages/[action]/route.ts");
const { database,catalogue,owns } = require("../lib/packages/store.ts");
const { session } = require("../lib/packages/session.ts");
const provider = new Map();
let outcome = "completed";
let captureRequests = 0;
global.fetch = async (address, options) => {
  const target = new URL(address);
  assert.equal(target.origin,"https://api-m.sandbox.paypal.com");
  if (target.pathname.endsWith("/token")) return Response.json({access_token:"test-token"});
  const [,id,action] = target.pathname.split("/orders")[1].split("/");
  if (!id) {
    const order = { id: randomUUID(), status: "CREATED", purchase_units: JSON.parse(options.body).purchase_units };
    order.links = [{rel:"payer-action",href:"https://www.sandbox.paypal.com/checkoutnow?token="+order.id}];
    provider.set(order.id,order);
    return Response.json(order);
  }
  const order = provider.get(id);
  if (action === "capture") {
    captureRequests++;
    if (outcome === "declined") return Response.json({details:[{issue:"INSTRUMENT_DECLINED"}]}, {status:422});
    order.status = "COMPLETED";
    const unit = order.purchase_units[0];
    unit.payments = {captures:[{id:randomUUID(),status:"COMPLETED",amount:outcome === "mismatch" ? {...unit.amount,value:"0.01"} : unit.amount}]};
    if (outcome === "timeout") throw new Error("Lost capture response");
  }
  return Response.json(order);
};
async function call(action, fields = {}, host = "localhost:3000") {
  const data = new FormData();
  Object.entries(fields).forEach(([k,v])=>data.set(k,v));
  const req = new Request("http://localhost:3000/api/packages/"+action,{method:"POST",headers:{origin:process.env.DEMO_APP_ORIGIN,host},body:data});
  const res = await POST(req,{params:Promise.resolve({action})});
  return {status:res.status,...await res.json()};
}
async function login(actor,mode="resume") {
  const result = await call("session",{actor,mode,key:process.env.DEMO_PRESENTER_KEY});
  assert.equal(result.status,200);
  return (await session()).user;
}
async function order(pkg) {
  const form = {id:pkg,price:"0",user_id:"other",status:"completed"};
  const [first,again] = await Promise.all([call("order",form),call("order",form)]);
  assert.equal(first.status,200);
  assert.equal(first.url,again.url);
  const remote = provider.get(new URL(first.url).searchParams.get("token"));
  assert.equal(remote.purchase_units[0].amount.value,"3.21");
  return { remote, id:remote.purchase_units[0].reference_id };
}
async function main() {
  const sql = database();
  assert.equal((await catalogue()).length,4);
  assert.deepEqual((await catalogue()).filter(p=>["free","starter"].includes(p.id)).map(p=>p.price),["0.00","0.00"]);
  assert.equal((await call("order",{id:"learning"})).status,403);
  assert.equal((await call("session",{actor:"admin",key:"wrong",mode:"resume"})).status,403);
  Object.assign(process.env, { NODE_ENV: "production", DEMO_LOCAL_STUDENT: "true" });
  assert.equal((await call("local-student")).status,403);
  process.env.NODE_ENV = "development";
  process.env.NETLIFY = "true";
  assert.equal((await call("local-student")).status,403);
  delete process.env.NETLIFY;
  assert.equal((await call("local-student", {}, "demo.netlify.app")).status,403);
  assert.equal((await call("local-student", {actor:"admin",space:"other",mode:"purchased"})).status,200);
  const local = await session();
  assert.equal(local.actor,"alex");
  assert.match(local.space,/^[a-f0-9-]{36}$/);
  assert.equal(await owns(local.user,"learning"),false);
  assert.equal((await call("local-student")).status,200);
  assert.equal((await session()).user,local.user);
  await login("admin");
  assert.equal((await call("local-student")).status,403);
  for (const id of ["learning","project"]) {
    const update = {id,description:"Test package",inclusions:"First\nSecond",price:"3.21"};
    assert.equal((await call("edit",update)).status,200);
    assert.equal((await catalogue()).find(p=>p.id===id).active,false);
    assert.equal((await call("edit",{...update,active:"on"})).status,200);
    assert.deepEqual((await catalogue()).find(p=>p.id===id).inclusions,["First","Second"]);
  }
  const alex = await login("alex");
  assert.equal((await call("edit")).status,403);
  assert.equal((await call("order",{id:"free"})).status,409);
  assert.equal((await call("order",{id:"project"})).status,409);
  assert.equal((await call("activity",{id:"planning",status:"started"})).status,403);
  const {remote,id} = await order("learning");
  assert.equal((await call("capture",{id})).status,"pending");
  assert.equal(await owns(alex,"learning"),false);
  await login("emma");
  assert.equal((await call("capture",{id})).status,409);
  await login("alex");
  remote.status = "APPROVED";
  outcome = "timeout";
  const results = await Promise.all([call("capture",{id}),call("capture",{id})]);
  assert.deepEqual(results.map(r=>r.status),["completed","completed"]);
  assert.equal(captureRequests,1);
  assert.equal((await sql`select * from ezra_demo.purchases where order_id=${id}`).length,1);
  assert.equal((await sql`select * from ezra_demo.course_progress where user_id=${alex}`).length,0);
  assert.equal(await owns((await session()).user,"learning"),true);
  await require("../lib/learning/actions.ts").recordLearning({ type: "completeAssessment", answers: {data:1,analysis:0,communication:2,delivery:1}, evidenceProvided:true });
  for (const status of ["started","completed"]) assert.equal((await call("activity",{id:"planning",status})).status,status);
  assert.equal(await owns(await login("emma"),"learning"),false);
  for (const mode of ["cancel","declined","mismatch"]) {
    const user = await login("emma","empty");
    const other = await order("learning");
    outcome = mode;
    other.remote.status = "APPROVED";
    const result = await call(mode==="cancel" ? "cancel":"capture",{id:other.id});
    assert.equal(result.status,mode==="cancel" ? "cancelled":mode==="declined" ? "failed":503);
    assert.equal(await owns(user,"learning"),false);
  }
  const paidCompany = await login("northstar","empty");
  assert.equal((await call("create-course")).status,403);
  const projectOrder = await order("project");
  projectOrder.remote.status = "APPROVED";
  outcome = "completed";
  assert.equal((await call("capture",{id:projectOrder.id})).status,"completed");
  assert.equal(await owns(paidCompany,"project"),true);
  assert.equal(await owns(await login("willow"),"project"),false);
  const company = await login("northstar","purchased");
  assert.equal(await owns(company,"project"),true);
  assert.equal(await owns(await login("willow"),"project"),false);
  assert.equal(await owns(await login("alex","cancelled"),"learning"),false);
  await login("admin");
  const courseId = "exercise-" + randomUUID();
  const newPackage = "package-" + randomUUID();
  assert.equal((await call("create-package",{id:newPackage,title:"Fictional practice package",description:"Demo",inclusions:"Exercise"})).status,200);
  const course = {id:courseId,title:"Fictional assigned course",description:"Demo lesson",scenario:"Review fictional totals",question:"What changed?",minutes:"15",package:newPackage};
  assert.equal((await call("create-course",course)).status,200);
  assert.equal((await call("assign",{id:courseId,student:"alex"})).status,200);
  const { readLearning } = require("../lib/learning/store.ts");
  const { recordLearning } = require("../lib/learning/actions.ts");
  const assignedStudent = await login("alex");
  const plan = await readLearning(assignedStudent);
  assert.equal(plan.assignedCourses.length,4);
  assert.equal(plan.assignedCourses.find(c=>c.id===courseId).title,course.title);
  await recordLearning({type:"completeAssessment",answers:{data:1,analysis:0,communication:2,delivery:1},evidenceProvided:true});
  await assert.rejects(()=>recordLearning({type:"startActivity",id:courseId}));
  await login("admin");
  assert.equal((await call("course",{...course,package:""})).status,200);
  await login("alex");
  await recordLearning({type:"startActivity",id:courseId});
  await recordLearning({type:"completeActivity",id:courseId});
  assert.deepEqual((await readLearning(assignedStudent)).completedActivities,[courseId]);
  assert.equal((await readLearning(await login("emma"))).completedActivities.includes(courseId),false);
  console.log("Package integration checks passed with PostgreSQL and mocked Sandbox responses.");
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>database().end());
