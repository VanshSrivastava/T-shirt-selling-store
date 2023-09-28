import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { cartEmpty, loadCart } from "./helper/carthelper";
import StripeCheckoutBtn from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderHelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;

    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  // const getFinalPrice = () => {
  //     console.log(products);
  //     return products.reduce((acc, product) => acc + product.price, 0);
  //   }
  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        const { status } = response;
        console.log("STATUS", status);
        // cartEmpty();
      })
      .catch((error) => console.log(error));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutBtn
        stripeKey="pk_test_51LqHSoSDmRUl9n01yv09xCQ8ezrnqCaZJxTYuzTGnKaUS8vcPM40D2rE2Yw9gQQEnQQ87q1dKw881ftdHHgcPfvr00BPIrlnh8"
        token={makePayment()}
        amount={getFinalAmount() * 100}
        name="Buy Products"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with Stripe</button>
      </StripeCheckoutBtn>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Sign in to Continue</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">Stripe Checkout ₹{getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};
export default StripeCheckout;
