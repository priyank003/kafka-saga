import React from "react";
import { useStateValue } from "../StateProvider";
import styled from "styled-components";
import Navbar from "./Navbar";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "../reducer";
import { useNavigate } from "react-router-dom";
import Product from "./Product";
function Checkout() {
  const [{ basket }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const removeFromBasket = (e, id) => {
    e.preventDefault();

    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };

  console.log("checkout >>>>>", basket);
  return (
    <Container>
      <Navbar />

      <Main>
        <ShoppingCart>
          <h2>Shopping Cart</h2>

          {basket?.map((product) => {
            console.log(product);
            return (
              // <Product>
              //   <Image>
              //     <img src={product.image} alt="" />
              //   </Image>
              //   <Description>
              //     <h2>{product.title}</h2>
              //     <p>✅ In stock</p>
              //     <p className="desc">{product.description}</p>
              //   </Description>
              //   <Price>
              //     <h1>₹ {product.price}</h1>
              //     <button onClick={(e) => removeFromBasket(e, product.id)}>
              //       Remove
              //     </button>
              //   </Price>
              // </Product>
              <Product product={product} onRemove={removeFromBasket} />
            );
          })}
        </ShoppingCart>
        <Subtotal>
          <CurrencyFormat
            renderText={(value) => (
              <>
                <p>
                  Subtotal ( {basket.length} items ) : <strong> {value}</strong>
                </p>
                {/* <small>
                  <input type="checkbox" />
                  <span>This order contains a gift.</span>
                </small> */}
              </>
            )}
            decimalScale={2}
            value={getBasketTotal(basket)}
            displayType="text"
            thousandSeparator={true}
            prefix={"₹ "}
          />

          <button onClick={() => navigate("/address")}>
            Proceed to Checkout
          </button>
        </Subtotal>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  min-height: 100vh;
  height: fit-content;
  margin: auto;
  background-color: rgb(234, 237, 237);

  position: relative;
`;
const Main = styled.div`
  display: flex;
  padding: 15px;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;
const ShoppingCart = styled.div`
  padding: 15px;

  flex: 0.7;

  @media only screen and (max-width: 1200px) {
    flex: none;
  }

  h2 {
    font-weight: 500;
    border-bottom: 1px solid lightgray;
    padding-bottom: 15px;
  }
`;
const Subtotal = styled.div`
  flex: 0.3;
  background-color: #fff;
  margin-left: 15px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 1200px) {
    flex: none;
    margin-top: 20px;
  }
  p {
    font-size: 20px;
  }

  small {
    display: flex;
    align-items: center;
    margin-top: 10px;

    span {
      margin-left: 10px;
    }
  }

  button {
    width: 65%;
    height: 33px;
    margin-top: 20px;
    background-color: #eaeaea;
    border: none;
    outline: none;

    border-radius: 8px;
  }
`;

const Products = styled.div`
  background: white;
  padding: 25px 10px;
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
  flex: 0.7;
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
    padding: 10px 0;

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
export default Checkout;
