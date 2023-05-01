import axios from "../axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import { useStateValue } from "../StateProvider";
import Navbar from "./Navbar";
import { getProducts } from "../Api/index";
import banner from "../assets/_DesktopTallHero_3000x1200._CB591042106_.jpg";
import AIT from "../assets/ait2.55aa091d.55aa091d.webp";
function Home() {
  const [products, setProducts] = useState("");

  useEffect(() => {
    const fetchdata = async () => {
      const res = await getProducts();

      setProducts(res.data);
    };
    fetchdata();
  }, []);

  return (
    <Container>
      <Navbar />
      <Banner>
        {/* <img src="./banner.jpg" alt="" /> */}
        {/* <img src="./mobile_banner.jpg" alt="" /> */}
        <img
          src={banner}
          alt="banner"
          style={{ borderRadius: "25px 25px 0 0 " }}
        />
      </Banner>

      <Main>
        {products &&
          products?.map((product) => (
            <Card
              pid={product.pid}
              id={product._id}
              image={product.img}
              price={product.price}
              rating={product.rating}
              title={product.name}
              description={product.description}
            />
          ))}
        {products &&
          products?.map((product) => (
            <Card
              pid={product.pid}
              id={product._id}
              image={product.img}
              price={product.price}
              rating={product.rating}
              title={product.name}
            />
          ))}
        {products &&
          products?.map((product) => (
            <Card
              pid={product.pid}
              id={product._id}
              image={product.img}
              price={product.price}
              rating={product.rating}
              title={product.name}
            />
          ))}
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  // background-color: white;
  max-width: 1400px;
  margin: auto;
  height: max-content;
`;

const Banner = styled.div`
  width: 100%;
  img {
    width: 100%;
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 2),
      rgba(0, 0, 0, 0.95),
      rgba(0, 0, 0, 0.85),
      rgba(0, 0, 0, 0.75),
      rgba(0, 0, 0, 0.55),
      rgba(0, 0, 0, 0)
    );

    &:nth-child(2) {
      display: none;
    }

    @media only screen and (max-width: 767px) {
      &:nth-child(1) {
        display: none;
      }

      &:nth-child(2) {
        display: block;
        -webkit-mask-image: none;
      }
    }
  }
`;

const Main = styled.div`
  position: relative;
  bottom: 100px;
  z-index: 1;
  // display: grid;
  // justify-content: center;
  // place-items: center;
  width: 100%;

  // grid-auto-rows: 420px;
  // grid-template-columns: repeat(4, 280px);
  // grid-gap: 20px;

  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  /* Mobile */
  @media only screen and (max-width: 767px) {
    grid-template-columns: repeat(2, 50%);
    grid-gap: 0;
  }

  /* Tablets */

  @media only screen and (min-width: 767px) and (max-width: 1200px) {
    grid-template-columns: repeat(3, 30%);
  }

  @media only screen and (min-width: 767px) {
    margin-top: -130px;
    padding: 10px 0px;
  }
`;
export default Home;
