import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect,useState } from "react";
import { useReducer } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Rating from "../components/Rating";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function ProductScreen() {
    const navigate = useNavigate();
    const params = useParams();
    const { slug } = params;

    // const [products,setProducts]=useState([]);
    //用reducer代替了useState
    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: '',
    });

    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST " });
            try {
                const result = await axios.get(`/api/products/slug/${slug}`)
                dispatch({ type: "FETCH_SUCCESS", payload: result.data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: getError(err) });
            }

        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }

        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

        navigate('/cart');
    }


    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Row>
                <Col md={6}>
                    <img
                        className="img-large"
                        src={selectedImage || product.image}
                        alt={product.name}
                    ></img>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">

                        <ListGroup.Item >
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                            <h1>{product.name}</h1>
                        </ListGroup.Item >

                        <ListGroup.Item >
                            <Rating
                                rating={product.rating}
                                numReviews={product.numReviews}
                            ></Rating>
                        </ListGroup.Item >

                        <ListGroup.Item >Price:${product.price}</ListGroup.Item >

                        <ListGroup.Item>
                            <Row xs={1} md={2} className="g-2">
                                {[product.image, ...product.images].map((x) => (
                                    <Col key={x}>
                                        <Card>
                                            <Button
                                                className="thumbnail"
                                                type="button"
                                                variant="light"
                                                onClick={() => setSelectedImage(x)}
                                            >
                                                <Card.Img variant="top" src={x} alt="product" />
                                            </Button>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item >
                            Description:
                            <p>{product.description}</p>
                        </ListGroup.Item >

                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ?
                                                (<Badge bg="success">In Stock </Badge>)
                                                : (<Badge bg="danger">Sold Out</Badge>)
                                            }
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item >
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler} variant="primary">
                                                添加到购物车
                                            </Button>
                                            <br />

                                        </div>
                                    </ListGroup.Item >
                                )}

                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>)


}
export default ProductScreen;