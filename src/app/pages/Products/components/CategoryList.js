import * as React from 'react';
import { Carousel } from 'antd';
import styled from 'styled-components';
import request from 'utils/request';
import { genImgUrl } from 'utils/helpers';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function CategoryList(props) {
  const [categories, setCategories] = React.useState([]);
  const [selected, setSelected] = React.useState(props.selected);

  React.useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  React.useEffect(() => {
    const getCategories = async () => {
      const response = await request(
        'product-service/categories-listing?page=1&page_size=100&is_top=true',
        {},
      )
        .then(response => response)
        .catch(error => error);

      if (response.is_success) {
        setCategories(response.data);
        props.onCategoryCallBack(response.data);
      }
    };

    getCategories();
  }, []);

  const handleChangeCategory = value => {
    props.onChangeCategory(value);
  };

  const SampleNextArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <RightOutlined />
      </div>
    );
  };

  const SamplePrevArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        <LeftOutlined />
      </div>
    );
  };

  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 2,
  };

  const clearHandle = () => {
    handleChangeCategory();
    props.onSearchByKeyword({});
  };

  return (
    <CustomCarousel>
      <div className="carousel-content">
        <div className="carousel-item-all">
          <div className="carousel-thumb">
            <svg
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.125 7.25H11.25V9.5L10.5 9.00781L9.75 9.5V7.25H7.875C7.66406 7.25 7.5 7.4375 7.5 7.625V12.125C7.5 12.3359 7.66406 12.5 7.875 12.5H13.125C13.3125 12.5 13.5 12.3359 13.5 12.125V7.625C13.5 7.4375 13.3125 7.25 13.125 7.25ZM4.125 5.75H9.375C9.5625 5.75 9.75 5.58594 9.75 5.375V0.875C9.75 0.6875 9.5625 0.5 9.375 0.5H7.5V2.75L6.75 2.25781L6 2.75V0.5H4.125C3.91406 0.5 3.75 0.6875 3.75 0.875V5.375C3.75 5.58594 3.91406 5.75 4.125 5.75ZM5.625 7.25H3.75V9.5L3 9.00781L2.25 9.5V7.25H0.375C0.164062 7.25 0 7.4375 0 7.625V12.125C0 12.3359 0.164062 12.5 0.375 12.5H5.625C5.8125 12.5 6 12.3359 6 12.125V7.625C6 7.4375 5.8125 7.25 5.625 7.25Z"
                fill="#6C798F"
              />
            </svg>
          </div>

          <div className="carousel-name" onClick={clearHandle}>
            Tất cả
          </div>
        </div>
        <Carousel arrows {...settings}>
          {categories?.map(category => (
            <CarouselItem
              category={category}
              key={category.id}
              onSelect={handleChangeCategory}
              isActive={category.id === selected}
            />
          ))}
        </Carousel>
      </div>
    </CustomCarousel>
  );
}

function CarouselItem(props) {
  const handleClick = () => {
    if (props.isActive) {
      props.onSelect();
    } else {
      props.onSelect(props.category.id);
    }
  };

  return (
    <div
      className={`carousel-item ${props.isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div className="carousel-thumb">
        <img
          src={genImgUrl({
            width: 26,
            height: 26,
            location: props.category?.thumb?.location,
          })}
          alt=""
        />
      </div>

      <div className="carousel-name">{props.category?.name}</div>
    </div>
  );
}

const CustomCarousel = styled.div`
  .carousel-content {
    margin: 25px auto 0;
    width: 909px;

    .carousel-item-all {
      position: absolute;
      display: flex;
      background: #fff;
      width: 85px;
      height: 26px;
      z-index: 2;
      justify-content: center;
      align-items: center;
      margin-left: -15px;

      &:hover {
        color: #3d56a6;
        cursor: pointer;
      }

      .carousel-thumb {
        background: #f4f6fd;
        border-radius: 3px;
        width: 26px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 6px;
      }
    }
  }

  .ant-carousel {
    .slick-slide {
      width: auto !important;
      padding: 0 15px;
    }
    .slick-prev {
      left: -45px;
      top: 35%;
      border-radius: 50%;

      &:hover {
        color: black;
        background: rgb(244, 246, 253);
      }
    }
    .slick-next {
      right: -45px;
      top: 35%;
      border-radius: 50%;

      &:hover {
        color: black;
        background: rgb(244, 246, 253);
      }
    }
    .slick-list {
      .slick-slide {
        pointer-events: auto;
      }
    }
  }

  @media (min-width: 1600px) {
    .carousel-content {
      width: 1170px;
    }
    .ant-carousel {
      padding-left: 15px;
    }
    .slick-prev {
      left: -60px !important;
    }
  }
  .carousel-item {
    display: flex;
    align-items: center;

    .carousel-thumb {
      margin-right: 6px;
    }

    .carousel-name {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #333333;
      cursor: pointer;

      &:hover {
        color: #3d56a6;
      }
    }
  }
  .slick-arrow {
    color: black;
    font-size: 12px;
    line-height: 1.5715;
    background: rgb(244, 246, 253);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 26px;
    height: 26px;

    &:before {
      display: none;
    }
  }
`;
