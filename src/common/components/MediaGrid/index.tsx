import { OrUndefined } from "../../types/OrUndefined";
import { MediaList } from "../../types/TmdbTypes/mediaList.types";
import { MovieListItem } from "../../types/TmdbTypes/mediaListItem.types";
import { MediaTile, MediaTileProps } from "../MediaTile";
import { GridList } from "./styled";

interface MediaGridProps {
    mediaList: OrUndefined<MediaList>;
    extractTileProps: (mediaItem: MovieListItem) => MediaTileProps;
}

export const MediaGrid = ({ mediaList, extractTileProps }: MediaGridProps) => {
    return (
        <section>
            <GridList>
                {mediaList?.map((mediaItem) => (
                    <MediaTile
                        {...extractTileProps(mediaItem)}
                    />
                ))}
            </GridList>
        </section>
    );
};