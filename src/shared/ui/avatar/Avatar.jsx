import cn from "classnames";
import styles from './style.module.sass'

const Avatar = ({ imageSrc, className, size = 36 }) => {
    return (
        <div className={cn(styles.logo, className)}>
            <img style={{ width: size, height: size }} src={imageSrc} />
        </div>
    );
};

export default Avatar;
