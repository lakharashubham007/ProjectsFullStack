import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom , getTotalCartValue } from "./Cart";
//import { unstable_useEnhancedEffect } from "@mui/material";


// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const [data, updateData] = useState([]);
  const [loading, updateLoading] = useState(false);
  const [timerId, updatetimerId] = useState(500);
  const [cartItems, updateCartItems] = useState([]);
  const [items, updateItems] = useState([]);


  
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    let token = localStorage.getItem("token");
    performAPICall();
    fetchCart(token);
  },[]);

  useEffect(() => {
    let filt = generateCartItemsFrom(cartItems, data);
    updateItems(filt);
  }, [data, cartItems]);

 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      updateLoading(true);
      let response = await axios.get(config.endpoint + "/products");
      updateData(response.data);
    } catch (err) {
      updateLoading(false);
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        { variant: "error" }
      );
    }
    updateLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    updateLoading(true);
    try {
      const response = await axios(
        config.endpoint + `/products/search?value=${text}`
      );
      updateData(response.data);
    } catch (err) {
      if (err.response.status === 404) {
        updateData([]);
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
    updateLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
   const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(config.endpoint + "/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      updateCartItems(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    let timer = setTimeout(() => performSearch(event.target.value), 500);
    updatetimerId(timer);
  };
  
  const isItemInCart = (items, productId) => {
    let match = false;
    items.forEach((i) => {
      if (i._id === productId) {
        match = true;
      }
    });
    return match;
  };
  
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "error",
      });
    } else if (isItemInCart(items, productId) && options.preventDuplicate) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
    } else {
      let response = await axios.post(
        config.endpoint + "/cart",
        JSON.stringify({
          productId: productId,
          qty: qty,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        }
      );
      updateCartItems(response.data);
    }
  };



  let token = localStorage.getItem("token");

  return (
    <div>
      <Header>
      <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          sx={{ width: 300 }}
          fullWidth
          onChange={(e) => {
            debounceSearch(e, timerId);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
      />

      <Grid container pb={2}>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={9} xs={12}>
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: 310 }}
            >
              <CircularProgress />
              <Box>Loading Products...</Box>
            </Box>
          ) : data.length ? (
            <Grid container spacing={2} p={2}>
              {data.map((i) => {
                return (
                  <Grid className="product-grid" item xs={6} md={3} key={i._id}>
                    <ProductCard
                      product={i}
                      handleAddToCart={() =>
                        addToCart(token, items, data, i._id, 1, {
                          preventDuplicate: true,
                        })
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ height: 310 }}
            >
              <SentimentDissatisfied />
              <Box>No products found</Box>
            </Box>
          )}
        </Grid>
         <Grid className="cart-wrapper" item md={3} xs={12}>
          <Cart
            products={data}
            items={items}
            handleQuantity={(qty, productId) =>
              addToCart(token, items, data, productId, qty)
            }
           />
        </Grid>
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
