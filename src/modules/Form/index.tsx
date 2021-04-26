// Libraries
import React from 'react';
import {Icon} from '@antscorp/components';

// Styles
import {FormStyled} from './styled';

const defaultForms: Array<{key: number | string, label: string}> = [
    {key: 1, label: 'Trống'},
    {key: 2, label: 'Thông tin liên hệ'},
    {key: 3, label: 'Trả lời sự kiện'},
    {key: 4, label: 'Lời mời dự tiệc'},
    {key: 5, label: 'Đăng ký áo phông'}
];

function Form() {
    return (
        <FormStyled>
            <h5>Bắt đầu biểu mẫu mới</h5>
            <div className='wrapper-forms'>
                {
                    defaultForms.map(form => {
                        return (
                            <section key={form.key} className='form-content'>
                                <div className='example-image'>
                                    <Icon type='icon-ants-add' />
                                </div>
                                <div className='form-title'>{form.label}</div>
                            </section>
                        );
                    })
                }
            </div>
        </FormStyled>
    );
}

export default Form;
