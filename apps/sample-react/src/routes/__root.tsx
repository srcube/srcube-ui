import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: RootLayout,
});

function RootLayout() {
	return (
		<div className="min-h-dvh bg-slate-100">
			<div className="mx-auto min-h-dvh w-full max-w-[430px] bg-slate-50">
				<Outlet />
			</div>
			<TanStackRouterDevtools position="bottom-right" />
		</div>
	);
}
