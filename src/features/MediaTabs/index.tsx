import { TabConfig, TabsPanel } from "../../common/components/TabsPanel"
import { Movies } from "../lists/Movies"

export const Explore = () => {
    const mediaTabsConfig: TabConfig[] = [
        {
            label: "Movies",
            queryParam: "movies",
            view: <Movies />
        }
    ]

    return (
        <>
            <TabsPanel
                tabsConfig={mediaTabsConfig}
            />
        </>
    )
}