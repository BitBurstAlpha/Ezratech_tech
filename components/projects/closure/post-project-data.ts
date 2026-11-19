export const salesProjectId = "northstar-sales-analysis";
export type ClosureRole = "sme" | "student" | "admin";
export type ClosureStatus = "closure_not_started" | "sme_review_pending" | "sme_closure_completed" | "student_acknowledgement_pending" | "closure_completed" | "admin_review_required";
export const statusText: Record<ClosureStatus, string> = {
  closure_not_started: "Closure not started", sme_review_pending: "SME review pending",
  sme_closure_completed: "SME closure completed", student_acknowledgement_pending: "Awaiting student acknowledgement",
  closure_completed: "Closed", admin_review_required: "Admin review required",
};
export const offerFields = { title: "Job Title", employmentType: "Employment Type", start: "Proposed Start Date", location: "Work Location", pay: "Salary or Pay Information (Optional)", summary: "Offer Summary" };
export const recommendationFields = { strengths: "Strengths Demonstrated", communication: "Professional Communication", quality: "Quality of Work", reliability: "Reliability", skills: "Skills Demonstrated", written: "Written Recommendation" };
export const opportunityFields = { positives: "Positive Contributions", development: "Areas for Development", reason: "Reason for No Further Opportunity", next: "Suggested Next Steps" };
export type Offer = Record<keyof typeof offerFields, string>;
export type Recommendation = Record<keyof typeof recommendationFields, string>;
export type OpportunityFeedback = Record<keyof typeof opportunityFields, string>;
export type OfferResponse = "interested" | "declined" | "discussion_requested";
export const responseText: Record<OfferResponse, string> = { interested: "Interested", declined: "Declined", discussion_requested: "Request Discussion" };
export type ClosureRecord = {
  status: ClosureStatus; feedback: string; contributionReviewed: boolean; materialsReviewed: boolean;
  employmentOutcome: "not_recorded" | "offer" | "no_further_opportunity";
  offer: Offer | null; offerResponse: OfferResponse | null; opportunityFeedback: OpportunityFeedback | null;
  recommendation: Recommendation | null; recommendationApproved: boolean; completionEvidenceAvailable: boolean;
  unmetCriteria: string; exceptionApproved: boolean; history: string[];
};
export function emptyClosure(accepted: boolean): ClosureRecord {
  return { status: accepted ? "sme_review_pending" : "closure_not_started", feedback: "", contributionReviewed: false, materialsReviewed: false,
    employmentOutcome: "not_recorded", offer: null, offerResponse: null, opportunityFeedback: null, recommendation: null,
    recommendationApproved: false, completionEvidenceAvailable: false, unmetCriteria: "", exceptionApproved: false, history: [] };
}
export type ClosureAction =
  | { kind: "feedback"; text: string; contributionReviewed: boolean; materialsReviewed: boolean }
  | { kind: "offer"; offer: Offer } | { kind: "recommendation"; recommendation: Recommendation }
  | { kind: "noOpportunity"; feedback: OpportunityFeedback } | { kind: "response"; value: OfferResponse }
  | { kind: "requestReview" | "criteria" | "clarification"; reason: string } | { kind: "reviewException"; approve: boolean }
  | { kind: "evidence" | "confirm" | "edit" | "submit" | "acknowledge" | "approveRecommendation" };
export function closureChecklist(record: ClosureRecord, reviewed: boolean, accepted: boolean) {
  return {
    "Final Deliverables Reviewed": reviewed, "Deliverables Accepted": accepted,
    "Final SME Feedback": !!record.feedback.trim(), "Student Contribution Reviewed": record.contributionReviewed,
    "Project Outcome Recorded": record.employmentOutcome !== "not_recorded" || !!record.recommendation || record.completionEvidenceAvailable,
    "Required Project Materials Reviewed": record.materialsReviewed,
    "Project Closure Confirmation": ["sme_closure_completed","student_acknowledgement_pending","closure_completed"].includes(record.status),
  };
}
export function canSubmitClosure(record: ClosureRecord, reviewed: boolean, accepted: boolean) {
  return Object.entries(closureChecklist(record, reviewed, accepted)).every(([label, done]) => label === "Project Closure Confirmation" || done);
}
export function updateClosure(record: ClosureRecord, action: ClosureAction, accepted: boolean, reviewed: boolean, submitted: boolean): ClosureRecord {
  function save(patch: Partial<ClosureRecord>, event: string) {
    return { ...record, ...patch, history: [...record.history, event] };
  }
  if (action.kind === "clarification" && record.history.length && action.reason.trim())
    return save({}, "Student requested clarification: " + action.reason.trim());
  if (action.kind === "response" && record.offer && action.value !== record.offerResponse)
    return save({ offerResponse: action.value }, "Student response: " + responseText[action.value]);
  if (action.kind === "acknowledge" && record.status === "student_acknowledgement_pending")
    return save({ status: "closure_completed" }, "Student acknowledged the closure summary and feedback.");
  if (action.kind === "approveRecommendation" && record.recommendation && !record.recommendationApproved && record.status === "closure_completed")
    return save({ recommendationApproved: true }, "Admin approved the recommendation for portfolio use.");
  if (action.kind === "reviewException" && record.status === "admin_review_required" && !accepted)
    return save({ exceptionApproved: action.approve, status: action.approve ? "student_acknowledgement_pending" : "closure_not_started" }, action.approve ? "Admin approved closure without accepted deliverables." : "Admin returned the project for revisions.");
  if (record.status === "sme_closure_completed") {
    if (action.kind === "submit" && canSubmitClosure(record, reviewed, accepted))
      return save({ status: "student_acknowledgement_pending" }, "SME submitted closure for student acknowledgement.");
    if (action.kind === "edit") return save({ status: "sme_review_pending" }, "SME reopened the closure draft.");
    return record;
  }
  if (!["sme_review_pending", "closure_not_started"].includes(record.status)) return record;
  if (action.kind === "criteria" && submitted && !accepted && action.reason.trim()) return save({ unmetCriteria: action.reason.trim() }, "SME recorded unmet acceptance criteria.");
  if (action.kind === "requestReview" && submitted && !accepted && action.reason.trim())
    return save({ unmetCriteria: action.reason.trim(), status: "admin_review_required" }, "SME requested EzraTech review of unmet acceptance criteria.");
  if (!accepted) return record;
  switch (action.kind) {
    case "feedback":
      if (action.text.trim()) return save({ feedback: action.text.trim(), contributionReviewed: action.contributionReviewed, materialsReviewed: action.materialsReviewed }, "SME recorded final feedback and review confirmations.");
      break;
    case "offer":
      if (Object.entries(action.offer).every(([key,value]) => key === "pay" || value.trim()) && ["Full-time","Part-time","Fixed-term","Other"].includes(action.offer.employmentType))
        return save({ employmentOutcome: "offer", offer: action.offer, offerResponse: null, opportunityFeedback: null }, "SME recorded a simulated employment offer.");
      break;
    case "noOpportunity":
      if (Object.values(action.feedback).every(value => value.trim()))
        return save({ employmentOutcome: "no_further_opportunity", opportunityFeedback: action.feedback, offer: null, offerResponse: null }, "SME recorded no further employment opportunity and constructive feedback.");
      break;
    case "recommendation":
      if (Object.values(action.recommendation).every(value => value.trim()))
        return save({ recommendation: action.recommendation, recommendationApproved: false }, "SME submitted a recommendation for portfolio approval.");
      break;
    case "evidence":
      if (reviewed && !record.completionEvidenceAvailable) return save({ completionEvidenceAvailable: true }, "SME recorded project completion evidence.");
      break;
    case "confirm":
      if (canSubmitClosure(record, reviewed, accepted)) return save({status:"sme_closure_completed"},statusText.sme_closure_completed);
  }
  return record;
}
