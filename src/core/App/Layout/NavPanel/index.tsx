import { NavItem, NavItemIcon, NavItemLabel, StyledNavPanel } from "./styled"

export const NavPanel = () => {
    const navItemsConfig = [
        {
            icon: "🎬",
            label: "Explore",
            routePath: "explore/"
        },
        {
            icon: "",
            label: "Preferences",
            routePath: "preferences/"
        },
    ];

    return (
        <StyledNavPanel>
            {
                navItemsConfig.map(({ icon, label, routePath }) => (
                    <NavItem to={routePath} key={label}>
                        <NavItemIcon>{icon}</NavItemIcon>
                        <NavItemLabel>{label}</NavItemLabel>
                    </NavItem>
                ))
            }
        </StyledNavPanel>
    );
};