import React from "react";
import {useTheme} from "../../../core/hooks/useTheme";

const Image = ({ className, src, srcDark, srcSet, srcSetDark, alt }) => {
    const theme = useTheme();
    return (
        <img
            className={className}
            srcSet={theme.isDark ? srcSetDark : srcSet}
            src={theme.isDark  ? srcDark : src}
            alt={alt}
        />
    );
}

export default Image;
