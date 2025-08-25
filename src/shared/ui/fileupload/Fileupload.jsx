import React, { useMemo, useRef } from 'react';
import styles from './styles.module.sass';
import {Icon} from "../icon";
const FileUpload = ({ onFileUpload }) => {
    const fileInputRef = useRef(null);

    const handleFileUpload = ({ target }) => {

        // const uploadedFiles = Array.from(target.files).map((file) => {
        //   const fileExtension = file.name.split('.').pop();
        // return {
        //   id: new Date(),
        //   name: file.name.replace(`.${fileExtension}`, ''),
        //   extension: `.${fileExtension}`,
        //   blob:file
        // };
        // });
        onFileUpload(target.files);
        // files..?forEach((file) => postFile(file, file.name));
    };

    return (
        <div className={styles.container}>
            <label className={styles.input}>
                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={(event) => handleFileUpload(event)}
                />
                <Icon
                    fillRule={'evenodd'}
                    fill={'#6F767E'}
                    name={'attach'}
                    size={24}
                    viewBox={'0 0 24 24'}
                />
            </label>
        </div>
    );
};

export default FileUpload;
