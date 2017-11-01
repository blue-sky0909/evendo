import Login from "../components/Login";
import Home from "../components/Home";
import Forgot from "../components/Forgot";
import Voucher from "../components/Voucher";
import Detail from "../components/Detail";
import ProductMap from "../components/Map";
import EventList from "../components/Event";

const Routes = {
    Login: { screen: Login },
    Event: { screen: EventList },
    Home: { screen: Home },
    More: { screen: Detail },
    Map: { screen: ProductMap },
    Forgot: { screen: Forgot },
    Voucher: { screen: Voucher }
};

export default Routes;
