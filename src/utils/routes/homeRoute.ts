export const getHomeRouteByRole = (role: string) => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
};
