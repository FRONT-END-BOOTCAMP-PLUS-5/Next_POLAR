'use client';

import { useState, useCallback } from 'react';
import { useHelpVerification } from '@/lib/contexts/HelpVerificationContext';
import { requestSeniorHelpCompletion } from '@/lib/api_front/help.api';

interface CompletionRequest {
  helpId: number;
  helpTitle: string;
}

interface CompletionResponse {
  success: boolean;
  verificationCode?: number;
  error?: string;
}

export function useSeniorHelpCompletion() {
  const { openSeniorVerificationCodeModal } = useHelpVerification();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 완료 요청 처리
  const requestCompletion = useCallback(
    async ({
      helpId,
      helpTitle,
    }: CompletionRequest): Promise<CompletionResponse> => {
      setIsPending(true);
      setError(null);

      try {
        const data = await requestSeniorHelpCompletion(helpId);

        const verificationCode = data.verificationCode;

        if (verificationCode) {
          // 시니어에게 인증번호 모달 열기
          openSeniorVerificationCodeModal(helpId, helpTitle, verificationCode);
        }

        return {
          success: true,
          verificationCode,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.';
        console.error('❌ 시니어 완료 요청 오류:', errorMessage);
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsPending(false);
      }
    },
    [openSeniorVerificationCodeModal]
  );

  return {
    requestCompletion,
    isPending,
    error,
  };
}
