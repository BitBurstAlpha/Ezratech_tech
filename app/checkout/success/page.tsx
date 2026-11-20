import { Receipt } from "@/components/packages/receipt";
export default async function Page({ searchParams }: PageProps<"/checkout/success">) {
  const { order } = await searchParams;
  return <Receipt id={typeof order === "string" ? order : undefined} cancel={false}/>;
}
