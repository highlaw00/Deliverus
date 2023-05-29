import React, {Fragment, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from 'mui-image';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import RecruitingPartyList from "./RecruitingPartyList";
import MenuCard from "./MenuCard";
import {API} from "../../utils/config";
import * as status from "../../utils/status";
import {UserContext} from "../store/UserContext";
import {Link, useParams} from "react-router-dom";
import RecruitingPartyCard from "./RecruitingPartyCard";

// 가게 조회 화면 컴포넌트입니다.
// prop으로 보여주고자 하는 가게 ID을 받습니다.
const RestaurantInfo = () => {
    const { userState, handleLogOut } = useContext(UserContext);
    const {userPos} = userState;
    const { id } = useParams();

    // 가게 정보를 담은 변수
    const [restaurant, setRestaurant] = useState({
        address: "string",
        category: "string",
        intro : "string",
        latitude: 0,
        longitude: 0,
        menu: {
            menu: [
                {
                    "menuName": "string",
                    "price": 0
                }
            ]
        },
        name: "",
        phoneNumber: "string",
        rating: 0
    });

    // 해당 가게에 대해서 모집 중인 딜리버스 파티방 정보를 담은 변수
    const [recruitingPartyList, setRecruitingPartyList] = useState(null);

    useEffect(() => {
        const data = { restaurantId: id};

        // 처음 페이지에 들어갈 때, 가게의 ID를 가지고 서버로부터 가게 정보 받기
        fetch(`${API.RESTAURANT_INFORMATION}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
            .then((respones) => {
                status.handleRestaurantResponse(respones.status);
                return respones.json();
            })
            .then((data) => {
                console.log("Respones Data from Restaurant Info API : ", data);
                setRestaurant(data);
            })
            .catch((error) => {
                // 로그인 만료 에러인 경우 로그아웃 실행
                if (error.name === "LoginExpirationError") {
                    handleLogOut();
                }
                // 요청한 것에 대한 데이터가 없을 때 에러 처리
                else if(error.name === "NoDataError") {
                    alert("error.message");
                }
                console.log(`${error.name} : ${error.message}`);
            });

        // 처음 페이지에 들어갈 때, 해당 가게에 대해 모집중인 파티방 리스트 가져오기
        fetch(`${API.PARTY_RESTAURANT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                id : id,
                latitude: userPos.lat,
                longitude: userPos.lng
            })
        })
            .then((respones) => {
                status.handlePartyResponse(respones.status);
                return respones.json();
            })
            .then((data) => {
                console.log("Respones Data from PARTY RESTAURANT API : ", data);
                setRecruitingPartyList(data);
            })
            .catch((error) => {
                // 로그인 만료 에러인 경우 로그아웃 실행
                if (error.name === "LoginExpirationError") {
                    handleLogOut();
                }
                console.log(`PARTY RESTAURANT API -> ${error.name} : ${error.message}`);
            });
    }, []);

    // 이미지를 src/images 디렉토리에서 가져옵니다.
    // 향후 이미지를 카테고리 별로 S3에 저장해서 모듈화 해야겠습니다.
    let image = null;
    if (!restaurant.name) {
        image = require(`../../images/delivery-cat.png`);
    } else {
        try{
            const category = restaurant.category.replace("/", ",");
            const name = restaurant.name;

            image = require(`../../images/${category}/${name}.png`);
        } catch(e){
            console.log(e);
            image = require(`../../images/delivery-cat.png`);
        }
    }

    const restaurantDescript = (<Box sx={{
        my: 2, display: "flex", flexDirection: "column", alignItems: "center", border: 1, borderRadius: '16px', py: 2
    }}>
        <Image src={image}
               height="250px"
               widht="250px"
               fit="contain"
               duration={1000}
        />
        <Typography component="h3" variant="h3" sx={{my: 3}}>
            {restaurant.name}
        </Typography>
        <Typography component="h6" variant="h6">
            {restaurant.intro}
        </Typography></Box>);

    // 가게 메뉴 정보 받아오기
    const MenuList = restaurant.menu.menu;
    const restaurantMenu = (<Fragment>
        <Typography component="h6" variant="h6" sx={{mb: 1}}>
            메뉴
        </Typography>
        <Stack spacing={3}>
            {MenuList.map((item, index) => {
                return (<MenuCard key={index} menu={item}/>);
            })}
        </Stack>
    </Fragment>);

    return (
        <>
            <Box component="main" sx={{
                my: 8,
                mx: 'auto',
                px: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                maxWidth: '800px'
            }}>
                {restaurantDescript}
                {recruitingPartyList && <RecruitingPartyList partyList={recruitingPartyList}/>}
                <Link to="/party/creation" state={{restaurantInfo : restaurant, resId : id}}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >내가 딜리버스 모집하기</Button>
                </Link>
                {restaurantMenu}
            </Box>
        </>);
}

export default RestaurantInfo;