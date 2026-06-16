import { useAppNotification } from "@/hooks/common/use-notifications";
import { useTypedNavigate } from "@/hooks/typed-hooks";
import { rootStore } from "@/stores/root.store";
import { useQueryClient } from "@tanstack/react-query";
import { authMutations } from "./use-auth";
import { delay } from "@repo/hooks";

export const useLogout = () => {
    const { authStore } = rootStore;
    const notification = useAppNotification();
    const navigate = useTypedNavigate();
    const queryClient = useQueryClient();

    const logoutMutation = authMutations.logout({
        onSuccess: () => {
            delay(2000).then(() => {
                queryClient.clear();
                authStore.clearSession();
                navigate('/auth/gz/login?redirectTo=' + window.location.pathname);
            })
        },
        onError: () => {
            notification.error("Logout Failed", "Something went wrong");
            authStore.setLoggingOut(false);
        },
        onMutate: () => {
            authStore.setLoggingOut(true);
        },
        onSettled: () => {
            authStore.setLoggingOut(false);
        }
    })

    return {
        onLogout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
        contextHolder: notification.notificationContextHolder,
    }
}