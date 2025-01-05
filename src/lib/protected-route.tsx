import { SignedIn, SignedOut } from '@clerk/clerk-react';

import { RedirectToSignIn } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
export default ProtectedRoute;
