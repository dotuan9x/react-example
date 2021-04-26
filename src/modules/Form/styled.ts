import styled from 'styled-components';

export const FormStyled = styled.div`
    padding: 20px;
    height: 100%;
    font-size: 14px;
    background: #fff;

    .wrapper-forms {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;

        .form-content {
            .example-image {
                display: flex;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                font-size: 50px;
                color: #fff;
                border-radius: 5px;
                height: 200px;
                width: 200px;
                background: #5cdbd3;
                transition: all 200ms;

                &:hover {
                    box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 0.433);
                }
            }

            .form-title {
                font-weight: 600;
                padding: 5px 0px;
            }
        }
    }
`;