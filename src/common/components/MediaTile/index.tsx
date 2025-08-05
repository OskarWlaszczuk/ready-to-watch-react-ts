import { tmdbApiUrls } from "../../constants/tmdbApiUrls";
import { OrNull } from "../../types/OrNull";
import { MediaImage, StyledMediaTile } from "./styled";


export interface MediaTileProps {
    imagePath: OrNull<string>;
    name: string;
    detailsRoute: string;
}

export const MediaTile = ({ imagePath, name, detailsRoute }: MediaTileProps) => (
    <StyledMediaTile to={detailsRoute}>
        <MediaImage src={`${tmdbApiUrls.image}w500${imagePath}`} alt={name} />
    </StyledMediaTile>
);