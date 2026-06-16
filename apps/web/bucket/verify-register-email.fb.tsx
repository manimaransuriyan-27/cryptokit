// import InvalidVerificationLink from '@/components/invalid-verification-link';
// import LinkAlreadyUsed from '@/components/link-already-used';
// import { useTypedLocation } from '@/hooks';
// import type { VerifyRegisterEmailErrorCode } from '@/types';
// import { Button } from '@repo/shared/components/ui/button';
// import { RotateCw } from 'lucide-react';
// import { observer } from 'mobx-react-lite';
// import { memo } from 'react';
// import { Navigate } from 'react-router-dom';

// const VerifyRegisterEmailFeedback = observer(() => {
//   const location = useTypedLocation<{ code: VerifyRegisterEmailErrorCode }>();
//   const code = location.state.code;

//   if (!code) {
//     return <Navigate to="/auth/access-denied" replace />;
//   }

//   return (
//     <div className="flex min-h-[80vh] animate-in flex-col justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
//       {code === 'LINK_ALREADY_USED' && <></>}
//       {code === 'INVALID_VERIFICATION_LINK' && <InvalidVerificationLink />}
//     </div>
//   );
// });

// VerifyRegisterEmailFeedback.displayName = 'VerifyRegisterEmailFeedback';

// export default memo(VerifyRegisterEmailFeedback);
