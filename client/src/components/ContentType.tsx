import React from 'react';
import { imageUrl } from '../etc/config';
import { Content, Userdata, content_userdata } from '../etc/api/content';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';
import { kakaoJskey } from '../etc/config';
import { like_vector } from '../img/Vectors';

import ReactPlayer from 'react-player';
import { parseDate } from '../etc';

import { BookMarkVector, leftVector, rightVector } from '../img/Vectors';
import ClipboardJS from 'clipboard';

interface Props {
  additionalClass: string;
  content: Content | null;
}

declare global {
  interface Window {
    Kakao: any;
  }
}

const { Kakao } = window;

function ContentType (props : Props) {
  let user = useSelector((state: RootReducer) => state.user);
  let content = props.content;
  let [id, setId] = React.useState<number>(1);
  let [userdata, setUserdata] = React.useState<Userdata>({ likes: [], bookmark: [], read: [] });
  let [share_container, setShare_container] = React.useState<boolean>(false);
  let uri = `mymemento.kr/contentpage/${id}`;
  let [liked, setLiked] = React.useState<boolean>(false);
  let [bookmarked, setBookmarked] = React.useState<boolean>(false);

  React.useEffect(() => {
    if(!content) return;
    setUserdata(content?.userdata);
    setId(content?.id);
    if(!user.loggedIn) {
      setLiked(false);
      setBookmarked(false);
    }
    else {
      setLiked(content?.userdata.likes.find((username) => (username === user.user!.username)) ? true : false );
      setBookmarked(content?.userdata.bookmark.find((username) => (username === user.user!.username)) ? true : false );
    }
  }, [content, user]);

  React.useEffect(() => {
    if(!Kakao.isInitialized())
      Kakao.init(kakaoJskey);
  }, []);

  let kakaoShare = () => {
    Kakao.Link.createDefaultButton({
      container: '#kakao-link_btn',
      objectType: 'feed',
      content: {
        title: `${content?.title}`,
        description: `${content?.tag}`,
        imageUrl:
          'https://welldying.s3.ap-northeast-2.amazonaws.com/img/content_small.png',
        link: {
          mobileWebUrl: `https://mymemento.kr/contentpage/${id}`,
          webUrl: `https://mymemento.kr/contentpage/${id}`,
        },
      },
      social: {
        likeCount: (content?.userdata.likes ? (content?.userdata.likes.length) : 0),
        commentCount: (content?.comments ? (content?.comments?.length) : 0),
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: `https://mymemento.kr/contentpage/${id}`,
            webUrl: `https://mymemento.kr/contentpage/${id}`,
          },
        },
      ],
    });
  }

  let facebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=https://mymemento.kr/contentpage/${id}`);
  }


  let [pagenumber, setPagenumber] = React.useState<number>(0);

  let copyLink = () => {
    let clipboard = new ClipboardJS('.clipboard_btn');

    clipboard.on('success', function(e) {
      alert('링크가 복사되었습니다. ');
    })
  }

  let PageContainer = React.useMemo(() => {
    if(!content) return <></>;
    let pagetotalnumber = content.detail.bookdetail.length;
    return (
      <>
      <div className="pageContainer" style = {{transition: 'all 0.8s ease-in-out', transform: `translateX(${-362 * pagenumber + 'px'})`, zIndex: -1}}>
        {[...Array(pagetotalnumber).keys()].map((key => {
          if(key === 0) {
            return (
                <div className="page">
                  <div className="number GB px20 px45 bold">#1</div>
                  <div className="subtitle GB px20 line40" style = {{marginTop: '5px'}}>{content?.detail.subtitle}</div>
                  <textarea name="" id="" cols = {36} rows={7} className="detail GB px13 line30" value = {content?.detail.bookdetail[0]} style  = {{marginTop: '40px', textAlign: 'justify'}} readOnly></textarea>
                </div>
            );
          } else {
              return (
                <div className="page" style = {{padding: '62px 56px 0px 58px '}}>
                  <textarea name="" id="" cols = {36} rows={10} className="detail GB px13 line30" value = {content?.detail.bookdetail[key]} readOnly></textarea>
                </div>
              );
          }
        }))}
      </div>
      <div className="buttonContainer">
        <button className="left" onClick = {() => setPagenumber(Math.max(pagenumber - 1, 0))}>{leftVector}</button>
        <div className="pagenumber NS px14 bold">{(pagenumber + 1) + '/' + (pagetotalnumber)}</div>
        <button className="right" onClick = {() => setPagenumber(Math.min(pagenumber + 1, pagetotalnumber - 1))}>{rightVector}</button>
      </div>
      </>
    );
  }, [content, pagenumber])

  if(!content) return <></>;
  else return (
    <>
      <div className = 'block'style = {{overflow: 'hidden', height: '630px', marginBottom: '-130px'}}>
          {props.additionalClass === '동영상' && <div className = 'videocontent'>
              <ReactPlayer width = {'769px'} height = {'432px'} url = {content.source} controls />
              <div className="donotplay"  style = {{width: '769px', height: '432px', position: 'absolute', top: '61px', left: '0px', cursor: 'pointer'}} onClick = {() => window.open(content?.source, '_blank')}></div>
              <div className = 'cover'>
                  <div className = 'detail GB px14 op6'>영상의 제목</div>
                  <div className = 'title GB px20 op9 line40'>{content.title.length > 30 ? content.title.slice(0, 30) + '...' : content.title}</div>
                  <div className = 'date GB px14 op9'>{'영상 제작일 : ' + String(parseDate(new Date(Number(content.date))))}</div>
                  <div className = 'tag GB px14 op6'>{content.tag}</div>
                  <div className={"vector_container like" + (liked ? ' liked' : '')} onClick = {user.loggedIn ? async () => {
                    let new_userdata = userdata;
                    if(userdata.likes.find((username) => (username === user.user!.username))) {
                      new_userdata.likes.splice(Number(userdata.likes.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.likes.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    setLiked(!liked);
                    await content_userdata(id, new_userdata);
                  } : () => {}} style = {{cursor: 'pointer'}}>{like_vector}</div>
                  <img alt = "" className = 'share_button' src = {imageUrl('ContentPage/share_button.png')} onClick = { () => {setShare_container(!share_container);}}  style = {{cursor: 'pointer'}}/>
                  <div className = 'more NS px12 bold op6' onClick = {() => window.open(content?.source, '_blank')} style = {{cursor: 'pointer'}}>{'원본파일 보기>'}</div>
                  <div className={"bookmark" + (bookmarked ? ' bookmarked' : '')} onClick = {user.loggedIn ? async () => {
                    let new_userdata = userdata;
                    if(userdata.bookmark.find((username) => (username === user.user!.username))) {
                      new_userdata.bookmark.splice(Number(userdata.bookmark.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.bookmark.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    setBookmarked(!bookmarked);
                    await content_userdata(id, new_userdata);
                  } : () => {}} style = {{cursor: 'pointer'}}>{BookMarkVector}</div>
              </div>
              {share_container && <div className = 'share_container'>
                  <img alt = "" id = 'kakao-link_btn' src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" onClick = {() => kakaoShare()} style = {{cursor: 'pointer'}} />
                  <img alt = "" src={imageUrl('ContentPage/facebook.png')} onClick = {() => facebookShare()} style = {{cursor: 'pointer'}} />
                  <div className="shareLink">
                      <input type="text NS px11" value = {`mymemento.kr/contentpage/${id}`} disabled/>
                      <button className="clipboard_btn copy NS px12 whiteop10" data-clipboard-text = {uri} onClick = {() => copyLink()}>링크 복사</button>
                  </div>
              </div>}
          </div>}
          {props.additionalClass === '책' && <div className = 'bookcontent margin_base'>
              <div className="whitecover" style = {{width: '1000px', position: 'absolute', height: '500px', left: '-1000px', top: '30px', background: 'rgba(255, 255, 255, 1)'}}></div>
              <div className = 'cover'>
                  <img alt = "" className = 'cover_image' src = {((content.imageData && content.imageData.imageUrl) ? content.imageData.imageUrl : imageUrl('ContentPage/DefaultThumbnail.png'))} style = {{width: '266px', height: '432px', objectFit: 'cover', borderRadius: '5px'}}/>
                  <div className = 'cover_blur' />
                  <div className = 'detail GB px14 op6'>책의 제목</div>
                  <div className = 'title GB px20 op9 line40'>{content.title.length > 30 ? content.title.slice(0, 30) + '...' : content.title}</div>
                  <div className = 'date GB px14 op9'>{'컨텐츠 제작일 : ' + String(parseDate(new Date(Number(content.date))))}</div>
                  <div className = 'tag GB px14 op6'>{content.tag}</div>
                  <div className={"vector_container like" + (liked ? ' liked' : '')} onClick = {user.loggedIn ? async () => {
                    let new_userdata = userdata;
                    if(userdata.likes.find((username) => (username === user.user!.username))) {
                      new_userdata.likes.splice(Number(userdata.likes.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.likes.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    setLiked(!liked);
                    await content_userdata(id, new_userdata);
                  } : () => {}} style = {{cursor: 'pointer'}}>{like_vector}</div>
                  <img alt = "" className = 'share_button' src = {imageUrl('ContentPage/share_button.png')} onClick = { () => {setShare_container(!share_container);}} style = {{cursor: 'pointer'}} />
                  <div className = 'more NS px12 bold op6' onClick = {() => window.open(content?.source, '_blank')} style = {{cursor: 'pointer'}}>{'책 구매하기>'}</div> 
                  <div className={"bookmark" + (bookmarked ? ' bookmarked' : '')} onClick = {user.loggedIn ? async () => {
                    let new_userdata = userdata;
                    if(userdata.bookmark.find((username) => (username === user.user!.username))) {
                      new_userdata.bookmark.splice(Number(userdata.bookmark.find((username) => (username === user.user!.username))), 1);
                    }
                    else {
                      new_userdata.bookmark.push(user.user!.username);
                    }
                    setUserdata(new_userdata);
                    setBookmarked(!bookmarked);
                    await content_userdata(id, new_userdata);
                  } : () => {}} style = {{cursor: 'pointer'}}>{BookMarkVector}</div>
              </div>
              {share_container && <div className = 'share_container'>
                  <img alt = "" id = 'kakao-link_btn' src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" onClick = {() => kakaoShare()} style = {{cursor: 'pointer'}} />
                  <img alt = "" src={imageUrl('ContentPage/facebook.png')} onClick = {() => facebookShare()} style = {{cursor: 'pointer'}} />
                  <div className="shareLink">
                      <input type="text NS px11" value = {`mymemento.kr/contentpage/${id}`} disabled/>
                      <button className="clipboard_btn copy NS px12 whiteop10" data-clipboard-text = {uri} onClick = {() => copyLink()}>링크 복사</button>
                  </div>
              </div>}
              <div className = 'vector' />
              {PageContainer}
          </div>}
      </div>
    </>
  );
}

export default ContentType;

