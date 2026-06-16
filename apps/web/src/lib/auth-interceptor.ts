import { useAuthStore } from "@/hooks/common/use-auth-store";
import { getQueryClient } from "./query-client";
import { useTypedNavigate } from "@/hooks/typed-hooks";

export function handleUnauthorized() {
    const navigate = useTypedNavigate()
    const store = useAuthStore()
    const queryClient = getQueryClient();
    queryClient.clear();
    store.clearSession()
    navigate('/auth/login', { replace: true })
}