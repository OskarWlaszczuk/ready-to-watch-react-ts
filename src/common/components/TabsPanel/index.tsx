import { TabLabel, TabLabelContent, TabLabelText, TabsCategories, TabsInfoContainer } from "./styled";
import { JSX, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface TabConfig {
    label: string;
    view: JSX.Element;
    queryParam: string;
}


export const useTabCategory = (tabsConfig: TabConfig[]) => {
    const navigate = useNavigate();
    const { pathname, search } = useLocation();

    const tabKey = "tab";
    const searchParams = new URLSearchParams(search);
    const currentTabParam = searchParams.get(tabKey);

    const activeTab = useMemo(() => {
        return tabsConfig.find((tab) => tab.queryParam === currentTabParam);
    }, [currentTabParam, tabsConfig]) || tabsConfig[0];

    const onTabChange = (newTabParam: string) => {
        searchParams.set(tabKey, newTabParam);
        navigate(`${pathname}?${searchParams.toString()}`);
    };

    return {
        activeTab,
        onTabChange,
    };
};


interface TabsPanelProps {
    tabsConfig: TabConfig[];
}

export const TabsPanel = ({ tabsConfig }: TabsPanelProps) => {
    const { activeTab, onTabChange } = useTabCategory(tabsConfig);
    console.log(activeTab)
    return (
        <TabsInfoContainer>
            <TabsCategories>
                {tabsConfig.map(({ queryParam, label }) => (
                    <>
                        <TabLabel
                            key={label}
                            $isActive={queryParam === activeTab?.queryParam}
                            onClick={() => onTabChange(queryParam)}
                        >
                            <TabLabelContent>
                            <TabLabelText>{label}</TabLabelText>
                            </TabLabelContent>
                        </TabLabel>
                    </>
                ))}
            </TabsCategories>
            <section>{activeTab?.view}</section>
        </TabsInfoContainer>
    );
};