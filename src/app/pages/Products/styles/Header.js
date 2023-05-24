import styled from 'styled-components/macro';
import Color from 'color';

export const ProductHeader = styled.div`
  background-color: ${({ theme }) => theme.whitePrimary};
  padding: ${({ theme }) => theme.space.s4 * 3}px
    ${({ theme }) => theme.space.s4 * 2}px;
`;

export const ProductSearchBar = styled.div`
  display: flex;
  width: 999px;
  margin: 0 auto;

  @media screen and (min-width: 1600px) {
    width: 1257px;
  }

  .form {
    flex: 1;
    display: flex;
    margin-right: ${({ theme }) => theme.space.s4}px;
    border: solid 1px ${({ theme }) => theme.primary};
    border-radius: ${({ theme }) => theme.radius}px;

    .fa-times-circle {
      width: ${({ theme }) => theme.space.s4 * 2}px;
      height: ${({ theme }) => theme.space.s4 * 2}px;
      line-height: ${({ theme }) => theme.space.s4 * 2}px;
      text-align: center;
      margin: ${({ theme }) => theme.space.s4 / 2 + 1}px
        ${({ theme }) => theme.space.s4}px;
      color: ${({ theme }) => theme.gray3};
      cursor: pointer;
    }

    input {
      flex: 1;
      margin-right: ${({ theme }) => theme.space.s4}px;
    }
  }
`;

export const ProductCategoryList = styled.div`
  border: solid 1px ${({ theme }) => theme.stroke};
  border-radius: ${({ theme }) => theme.radius}px;
  margin: ${({ theme }) => (theme.space.s4 / 6) * 7}px auto 0;
  width: 999px;

  @media screen and (min-width: 1600px) {
    width: 1257px;
  }

  .category {
    display: flex;
    flex-wrap: wrap;

    &-item {
      width: 20%;
      display: inline-flex;
      align-items: center;
      padding: ${({ theme }) => (theme.space.s4 / 6) * 5}px
        ${({ theme }) => theme.space.s4}px;
      border-bottom: solid 1px ${({ theme }) => theme.stroke};
      margin-bottom: -1px;
      cursor: pointer;

      &.active {
        background-color: ${({ theme }) => Color(theme.primary).fade(0.1)};
      }

      &:nth-child(n + 10):not(&-button) {
        display: none;
      }

      &:not(:nth-child(5n)) {
        border-right: solid 1px ${({ theme }) => theme.stroke};
      }

      &-button {
        border-right: none !important;
      }
    }

    &-thumb {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: ${({ theme }) => theme.space.s4 / 3}px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
  }

  &.category-showall .category-item:nth-child(n + 10):not(.category-button) {
    display: inline-flex;
  }
`;
