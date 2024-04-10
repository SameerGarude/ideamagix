import React, { useState, useEffect } from "react";
import "./App.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faHeart,
  faSearch,
  faAngleDown,
  faList,
  faTableCells,
  faAngleUp,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  // Fetch products from API link
  const fetchProducts = () => {
    fetch("https://fakestoreapi.com/products")
      .then(response => response.json())
      .then(data => {
        setProducts(data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(data.map(product => product.category)),
        ];
        setCategories(uniqueCategories);
        setFilteredProducts(data);
      })
      .catch(error => console.error("Error fetching products:", error));
  };

  // Fetch products from API when app starts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get current products based on pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = pageNumber => {
    fetchProducts();
    setCurrentPage(pageNumber);
  };

  const handleSearch = query => {
    // Set search query
    setSearchQuery(query);

    // Fetch products from API
    fetch("https://fakestoreapi.com/products")
      .then(response => response.json())
      .then(data => {
        // Set all products
        setProducts(data);

        // Filter products based on search query
        const filtered = data.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
      })
      .catch(error => console.error("Error fetching products:", error));
  };

  // // Function to handle search
  // const handleSearch = query => {
  //   setSearchQuery(query);
  //   // Filter products based on search query
  //   const filtered = products.filter(product =>
  //     product.title.toLowerCase().includes(query.toLowerCase())
  //   );
  //   setFilteredProducts(filtered);
  // };

  // Function to handle adding product to cart
  const handleAddToCart = product => {
    setCartItems([...cartItems, product]);
    // Fetch products again after adding to cart
    // fetchProducts();
  };

  const handleRemove = product => {
    const updatedCartItems = cartItems.filter(item => item.id !== product.id);
    setCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCategoryClick = category => {
    // Fetch products from API
    fetch("https://fakestoreapi.com/products")
      .then(response => response.json())
      .then(data => {
        // Set all products
        setProducts(data);

        // Apply filter after fetching
        const filtered = data.filter(product => product.category === category);
        setFilteredProducts(filtered);
      })
      .catch(error => console.error("Error fetching products:", error));
  };

  const handlePriceFilter = () => {
    // Fetch products from API
    fetch("https://fakestoreapi.com/products")
      .then(response => response.json())
      .then(data => {
        // Set all products
        setProducts(data);

        // Apply filter after fetching
        const filtered = data.filter(
          product => product.price >= minPrice && product.price <= maxPrice
        );
        setFilteredProducts(filtered);
      })
      .catch(error => console.error("Error fetching products:", error));
  };

  // const handleCategoryClick = category => {
  //   // Fetch products from API

  //   // Filter products based on the clicked category after fetching
  //   const filtered = products.filter(product => product.category === category);
  //   setFilteredProducts(filtered);
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, [categories]);

  // Function to handle filtering by price range
  // const handlePriceFilter = () => {
  //   const filtered = products.filter(
  //     product => product.price >= minPrice && product.price <= maxPrice
  //   );
  //   setFilteredProducts(filtered);
  //   // Fetch products again after applying price filter
  //   // fetchProducts();
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, [minPrice, maxPrice]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 0) {
        setIsHeaderFixed(true);
      } else {
        setIsHeaderFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <div className={`header-container ${isHeaderFixed ? "fixed" : ""}`}>
        <div className="header">
          <div className="logo">ideamagix</div>
          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search"
              className="search-input"
            />
            <button className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className="button">
            <div className="awesome">
              <FontAwesomeIcon icon={faUser} />
              <span>Sign in</span>
            </div>
            <div className="awesome">
              <FontAwesomeIcon icon={faHeart} />
              <span>Wishlist</span>
            </div>
            <div className="awesome" onClick={() => setIsCartOpen(!isCartOpen)}>
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>My cart</span>
            </div>
            <span className="cart-count">{cartItems.length}</span>
          </div>
        </div>
      </div>
      <div className="result">
        {searchQuery}
        <span>Home > Library > Data </span>
      </div>
      <div className="middle">
        <div className="left">
          <div className=" box">
            <div className="heading">
              Categories
              <FontAwesomeIcon icon={faAngleUp} style={{ color: "#3e7ad5" }} />
            </div>
            <div className="border-bottom"></div>
            <div className="vertical-elements">
              {categories.map(category => (
                <div
                  key={category}
                  className="element"
                  onClick={() => handleCategoryClick(category)}
                >
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>

          <div className=" box">
            <div className="heading">
              Brands
              <FontAwesomeIcon icon={faAngleUp} style={{ color: "#3e7ad5" }} />
            </div>
            <div className="border-bottom"></div>
            <div className="vertical-elements">
              <div className="element">
                <div className="tick">
                  <input type="checkbox" checked />
                  <label htmlFor="">Mercedes</label>
                </div>
                <div className="btn">
                  <span>120</span>
                </div>
              </div>
              <div className="element">
                <div className="tick">
                  <input type="checkbox" checked />
                  <label htmlFor="">Toyota</label>
                </div>
                <div className="btn">
                  <span>15</span>
                </div>
              </div>
              <div className="element">
                <div className="tick">
                  <input type="checkbox" checked />
                  <label htmlFor="">Mitsubishi</label>
                </div>
                <div className="btn">
                  <span>35</span>
                </div>
              </div>
              <div className="element">
                <div className="tick">
                  <input type="checkbox" checked />
                  <label htmlFor="">Nissan</label>
                </div>
                <div className="btn">
                  <span>89</span>
                </div>
              </div>
              <div className="element">
                <div className="tick">
                  <input type="checkbox" />
                  <label htmlFor="">Honda</label>
                </div>
                <div className="btn">
                  <span>30</span>
                </div>
              </div>
              <div className="element">
                <div className="tick">
                  <input type="checkbox" />
                  <label htmlFor="">Suzuki</label>
                </div>
                <div className="btn">
                  <span>30</span>
                </div>
              </div>
            </div>
          </div>

          <div className=" box">
            <div className="heading">
              Price
              <FontAwesomeIcon icon={faAngleUp} style={{ color: "#3e7ad5" }} />
            </div>
            <div className="border-bottom"></div>
            <div className="vertical-elements">
              <div className="inputs">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                />
              </div>
              <center>
                <button onClick={handlePriceFilter}>Apply</button>
              </center>
            </div>
          </div>

          <div className="box">
            <div className="heading">
              Size
              <FontAwesomeIcon icon={faAngleUp} style={{ color: "#3e7ad5" }} />
            </div>
            <div className="border-bottom"></div>
            <div className="vertical-elements size">
              <button className="element">XS</button>
              <button className="element">SM</button>
              <button className="element">LG</button>
              <button className="element">XXL</button>
            </div>
          </div>

          <div className="box">
            <div className="heading">
              Ratings
              <FontAwesomeIcon icon={faAngleUp} style={{ color: "#3e7ad5" }} />
            </div>
            <div className="border-bottom"></div>
            <div className="vertical-elements">
              <div className="element ratings">
                <input type="checkbox" checked />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
              </div>
              <div className="element">
                <input type="checkbox" checked />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "gray" }} />
              </div>
              <div className="element">
                <input type="checkbox" checked />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "gray" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "grey" }} />
              </div>
              <div className="element">
                <input type="checkbox" checked />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "yellow" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "gray" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "gray" }} />
                <FontAwesomeIcon icon={faStar} style={{ color: "gray" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="up">
            <p>0 Items found</p>
            <div className="btn">
              <div className="btn1">
                <span>Best match</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </div>

              <div className="btn2">
                <FontAwesomeIcon icon={faList} />
                <FontAwesomeIcon icon={faTableCells} />
              </div>
            </div>
          </div>

          {currentProducts.map(product => (
            <div key={product.id} className="product">
              <div className="one">
                <img src={product.image} alt={product.title} />
              </div>

              <div className="two">
                <h3>{product.title}</h3>
                <p>{product.category}</p>
                <p>{product.description}</p>
              </div>

              <div className="three">
                <p>$ {product.price}</p>
                <button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
                <button onClick={() => handleRemove(product)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination">
        {Array.from({
          length: Math.ceil(filteredProducts.length / productsPerPage),
        }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
      {isCartOpen && (
        <div className="cart">
          <h2>Cart</h2>
          <ul>
            {cartItems.map((item, index) => (
              <>
                <li key={index}>
                  {item.title}
                  <span>${item.price}</span>
                  <button onClick={() => handleRemove(item)}>Remove</button>
                </li>
              </>
            ))}
            <div>Total: ${calculateTotalPrice()}</div>
          </ul>
        </div>
      )}
      <div className="footer">Copyright © ideamagix 2024</div>
    </div>
  );
};

export default App;

//pixel perfect ,
