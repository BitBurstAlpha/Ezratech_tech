"use client";
import { editCompanyProfile, type CompanyProfileEdits } from "./profile/profile-data";
import { useDemoStoredState } from "@/components/demo/use-demo-stored-state";
import { createContext, useContext, type ReactNode } from "react";
import { mockSMEProfile, mockSMEOnboarding, setupConfirmations, validateSMEStep, type SMEProfile } from "./sme-data";
type SMEContextValue = { saveCompanyProfile: (edits: CompanyProfileEdits) => void; resetSME: (onboarded?: boolean) => void; profile: SMEProfile; onboarding: typeof mockSMEOnboarding; updateProfile: (patch: Partial<SMEProfile>) => void; setStep: (step: number) => void; setConfirmations: (values: string[]) => void; completeSetup: () => boolean; register: (contact: SMEProfile["primaryContact"], companyName: string) => void };
const SMEContext = createContext<SMEContextValue | null>(null);
export function SMEProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile, profileHydrated] = useDemoStoredState("sme:profile", () => ({ ...mockSMEProfile, primaryContact: { ...mockSMEProfile.primaryContact }, supervisor: { ...mockSMEProfile.supervisor }, projectAreas: [...mockSMEProfile.projectAreas] }));
  const [onboarding, setOnboarding, onboardingHydrated] = useDemoStoredState("sme:onboarding", () => ({ ...mockSMEOnboarding, confirmations: [] as string[] }));
  function resetSME(onboarded = false) {
    setProfile({ ...structuredClone(mockSMEProfile), supervisor: { name: "Sarah Collins", jobTitle: mockSMEProfile.primaryContact.jobTitle, email: mockSMEProfile.primaryContact.email } });
    setOnboarding({ ...structuredClone(mockSMEOnboarding), confirmations: onboarded ? [...setupConfirmations] : [], smeOnboardingComplete: onboarded });
  }
  function completeSetup() {
    if ([0, 1, 2, 3].some(step => validateSMEStep(profile, step)) || !setupConfirmations.every(item => onboarding.confirmations.includes(item))) return false;
    setOnboarding(current => ({ ...current, smeOnboardingComplete: true })); return true;
  }
  if (!(profileHydrated && onboardingHydrated)) return null;
  return <SMEContext.Provider value={{ saveCompanyProfile: edits => setProfile(current => editCompanyProfile(current, edits)), resetSME, profile, onboarding, updateProfile: patch => { setProfile(current => ({ ...current, ...patch })); setOnboarding(current => ({ ...current, smeOnboardingComplete: false })); }, setStep: step => setOnboarding(current => ({ ...current, step })), setConfirmations: confirmations => setOnboarding(current => ({ ...current, confirmations })), completeSetup, register: (primaryContact, companyName) => { setProfile(current => ({ ...current, primaryContact, companyName })); setOnboarding({ ...mockSMEOnboarding, confirmations: [] }); } }}>{children}</SMEContext.Provider>;
}
export function useSME() { const context = useContext(SMEContext); if (!context) throw new Error("SME flow requires SMEProvider"); return context; }
