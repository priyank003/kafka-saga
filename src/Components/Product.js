import React from "react";
import styled from "styled-components";
import { useStateValue } from "../StateProvider";

export default function Product({ product, onRemove }) {
  const [{ basket }, dispatch] = useStateValue();
  const removeFromBasket = (e, id) => {
    e.preventDefault();

    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };
  return (
    <Container>
      <Image>
        <img src={product.image} alt="" />
      </Image>
      <Description>
        <h2>{product.title}</h2>
        <p>✅ In stock</p>
        <p className="desc">{product.description}</p>
      </Description>
      <Price>
        <h1>₹ {product.price}</h1>
        <button onClick={(e) => removeFromBasket(e, product.id)}>Remove</button>
      </Price>
    </Container>
  );
}

const Container = styled.div`
  background: white;
  padding: 25px 5px;
  margin: 10px 0;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  // justify-content: space-between;
`;
const Image = styled.div`
  flex: 0.2;
  img {
    width: 100%;
    height: 200px;
  }
`;
const Description = styled.div`
  flex: 0.6;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  // align-self: flex-start;

  h2 {
    font-weight: 600;
    font-size: 18px;
    border: none;
  }

  p {
    font-weight: 600;
    // margin-top: 10px;
  }
  .desc {
    margin: 10px 0;

    color: gray;
  }

  button {
    background-color: transparent;
    color: #1384b4;
    border: none;
    outline: none;
    margin-top: 10px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const Price = styled.div`
  position: absolute;
  right: 0;
  padding: 10px;
  h2 {
    font-weight: 600;
    font-size: 18px;
  }

  p {
    font-weight: 600;
    // margin-top: 10px;
  }

  button {
    background-color: #eaeaea;
    width: 100%;
    padding: 10px;
    border-radius: 10px;

    // color: #1384b4;
    border: none;
    // outline: none;
    margin-top: 10px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
