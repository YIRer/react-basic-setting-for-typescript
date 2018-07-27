// export const fbKey = 711707568999682;
import locale from '../src/locale/locale';
export const fbKey = 966242223397117;

export const cdnUrl = !!process.env.CDN_URL? `//${process.env.CDN_URL}` : "/static";

export function setDefalutTitle (lang){
  switch(lang){
    case 'ko':
    return "테이스팀";
    case 'jp':
    return "テイスチーム";
    case 'en':
    return "Tasteem";
    default:
    return 'Tasteem';
  }
}
export function getTitle (location, param, state, defaultTitle){
  const getRoute = location.split('/')[1];
  const getLocaleData = locale.lang;
  switch(getRoute){
    case 'post':
    return state[getRoute]['view']["title"];
    break;
    case 'event':
    return state[getRoute]["eventDetailData"][param]["data"]["card_name"];
    break;
    case 'mypage':
    return `${param}${getLocaleData.menu.profile.page}`;
    break;
    default :
    return defaultTitle;
    break;
  }
}