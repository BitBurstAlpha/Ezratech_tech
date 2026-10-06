"use client";
import { useDemoProgress } from "@/components/student/progress/demo-progress";
import { WorkspaceDialog, secondaryButton } from "@/components/student/workspace/workspace-ui";
import { mockStudentPortfolio as student } from "./portfolio-data";
import { PortfolioPreview } from "./portfolio-preview";
import { experienceVerified } from "./evidence-record-data";
export function PublicPortfolioPreview({ onClose }: { onClose: () => void }) {
  const { progress } = useDemoProgress();
  const visibility = progress.fullPortfolioVisibility;
  const project = progress.portfolioVisibility;
  return <WorkspaceDialog title="Public Portfolio Preview" onClose={onClose}><article className="space-y-5"><header><h3 className="text-xl font-semibold">{student.name}</h3><p className="mt-2 text-sm text-primary">{student.careerGoal}</p>{visibility.location && <p className="mt-2 text-xs text-muted">{student.shortLocation}</p>}{visibility.availability && <p className="mt-2 text-xs text-muted">{student.availability}</p>}</header>{experienceVerified(progress) && <PortfolioPreview visibility={{ title: visibility.projects && project.title, company: visibility.projects && project.company, summary: visibility.summary && project.summary, skills: visibility.skills && project.skills, feedback: visibility.feedback && project.feedback, deliverables: visibility.evidence && project.deliverables }} />}<p className="text-xs leading-6 text-muted">Prototype preview only. This portfolio is not publicly hosted. SME permissions determine which material appears.</p><button type="button" onClick={onClose} className={secondaryButton}>Close Preview</button></article></WorkspaceDialog>;
}
