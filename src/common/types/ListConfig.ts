import { ListOptionType } from "./ListOptionType";
import { OrEmpty } from "./OrEmpty";

export interface ListConfig {
    options: OrEmpty<ListOptionType[]>;
    queryKey: string;
    label: string;
}