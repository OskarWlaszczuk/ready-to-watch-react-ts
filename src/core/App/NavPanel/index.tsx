import { NavItem, NavItemIcon, NavItemLabel, StyledNavPanel } from "./styled"

export const NavPanel = () => {
    const navItemsConfig = [
        {
            icon: "🎬",
            label: "home",
            routePath: "route"
        },
        {
            icon: "🎬",
            label: "home",
            routePath: "route"
        },
        {
            icon: "🎬",
            label: "home",
            routePath: "route"
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