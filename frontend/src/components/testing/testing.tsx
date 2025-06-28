import React, { useState } from 'react';
import './style.css'

const CartComponent = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setCartTotal(cartTotal + 1);
    }, 1000);
  };

  return (
    <>
      <div id="cart" className={`cart ${isAnimating ? 'shake' : ''}`} data-totalitems={cartTotal}>
        <i className="fas fa-shopping-cart"></i>
      </div>

      <div className="page-wrapper">
        <button
          id="addtocart"
          onClick={handleAddToCart}
          className={isAnimating ? 'sendtocart' : ''}
        >
          Add to Cart
          <span className="cart-item"></span>
        </button>
        <div className="new-version">
          <a href="https://codepen.io/designcouch/pen/MWLqKym">Check out Version 2 of this idea!</a>
        </div>
      </div>
    </>
  );
};

export default CartComponent;
