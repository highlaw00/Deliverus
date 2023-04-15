import { API } from "../../utils/config";
import { useContext } from "react";
import { UserContext } from "../../utils/context";
import * as status from "../../utils/status";

/**
 * 가게 정보를 받아오는 API를 테스트 하는 공간입니다.
 * 카테고리별로 가게 정보를 받아오거나, 가게 전체를 다 받아올 수 있습니다.
 */
const Restaurant = ({ myHandle }) => {
  const handleLogOutClicked = useContext(UserContext);

  const restaurantCategoryTest = (event) => {
    event.preventDefault();
    const data = { category: "중식", address: "남천동" }; // 예시 데이터
    fetch(
      `${API.RESTAURANT_CATEGORY}?category=${data.category}&address=${data.address}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((respones) => {
        // respones의 status를 확인해서 상황에 알맞은 Error를 던집니다.
        status.registerStatus(respones.status);
        return respones.json();
      })
      .then((data) => {
        console.log("Respones Data from Restaurant Category API : ", data);
      })
      .catch((error) => {
        // 로그인 만료 에러인 경우 로그아웃 실행
        if (error.name === "LoginExpirationError") {
          handleLogOutClicked();
        }
        console.log(`${error.name} : ${error.message}`);
      });
  };

  const restaurantAllTest = (event) => {
    event.preventDefault();
    fetch(`${API.RESTAURANT_ALL}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((respones) => {
        status.registerStatus(respones.status);
        return respones.json();
      })
      .then((data) => {
        console.log("Respones Data from Restaurant All API : ", data);
      })
      .catch((error) => {
        // 로그인 만료 에러인 경우 로그아웃 실행
        if (error.name === "LoginExpirationError") {
          handleLogOutClicked();
        }
        console.log(`${error.name} : ${error.message}`);
      });
  };

  return (
    <>
      <p>
        <button onClick={restaurantCategoryTest}>카테고리별 가게 확인</button>
      </p>
      <p>
        <button onClick={restaurantAllTest}>모든 가게 정보 확인</button>
      </p>
    </>
  );
};

export default Restaurant;
