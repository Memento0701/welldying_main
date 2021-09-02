import React from 'react';
import { useSelector } from 'react-redux';
import { Link, match, Redirect } from 'react-router-dom';
import { RootReducer } from '../store';
import Header from '../components/Header';
import NoteLeftBar from '../components/NoteLeftBar';
import NoteQuestion from '../components/NoteQuestion';
import useScroll from '../etc/useScroll';

import { getQuestions } from '../etc/api/question';
import { getSection, getSections } from '../etc/api/section';
import { getAnswers } from '../etc/api/answer';
import usePromise from '../etc/usePromise';

import { imageUrl } from '../etc/config';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function MementoNoteBook({ match } : Props) {
  let id = Number.parseInt(match.params.id);

  let scroll = useScroll();

  let user = useSelector((state: RootReducer) => state.user);
  let [scrollActive, setScrollActive] = React.useState(false);
  let [, questions] = usePromise(getQuestions);
  let question = questions?.find((question) => question.id === 1);
  let [, sections] = usePromise(() => getSections());
  let [, answers] = usePromise(getAnswers);
  let [block, setBlock] = React.useState<boolean>(false);
  let [addQuestions, setAddQuestions] = React.useState<boolean>(false);
  let [addSectionId, setAddSectionId] = React.useState<number>(0);
  let [categoryTotal, setCategoryTotal] = React.useState<boolean>(false);
  let [total, setTotal] = React.useState<boolean>(false);

  let section = React.useMemo(() => sections?.find((section) => section.id === id), [sections, id]);
  let section_add = React.useMemo(() => sections?.find((section) => section.id === addSectionId), [sections, addSectionId]);

  let [search_word, setSearch_word] = React.useState<string>('');

  let [order, setOrder] = React.useState<number>(0);

  let written_questions = React.useMemo(() => {
    return (
      questions?.filter((question) => {
        let answer = answers?.filter((answer) => answer.questionId === question.id);
        if(!answer) return false;
        else return true;
      })
    );
  }, [questions, answers]);

  let questions_written = React.useMemo(() => {
    return (
      <>
        {written_questions?.map((question, key) => {
          return (
            <NoteQuestion question = {question} written = {true} type = {(block ? 'small': 'type2')} order = {key}/>
          );
        })}
      </>
    );
  }, [questions, answers]);

  let section_written_questions = React.useMemo(() => {
    return (
      section?.questions?.filter((questionId) => {
        let question = questions.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        if (!question || !answer) return false;
        else return true;
      })
    );
  }, [section, questions, answers]);

  let section_questions_written = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section_written_questions?.map((questionId, key) => {
            let question = questions?.find((question) => question.id === questionId);
            return (
              <NoteQuestion question = {question} written = {true} type = {(block ? 'small': 'type2')} order = {key}/>
            );
          })}
      </>
    );
  }, [section_written_questions, block]);

  let section_written_questions_add = React.useMemo(() => {
    return (
      section_add?.questions?.filter((questionId) => {
        let question = questions.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        if (!question || !answer || answer.book !== 0) return false;
        else return true;
      })
    );
  }, [section_add, questions, answers]);

  let section_questions_add_written = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section_written_questions_add?.map((questionId, key) => {
            let question = questions?.find((question) => question.id === questionId);
            return (
              <NoteQuestion question = {question} written = {true} type = {'add'} order = {-1}/>
            );
          })}
      </>
    );
  }, [section_written_questions_add, block]);

  let section_unwritten_questions_add = React.useMemo(() => {
    return (
      section_add?.questions?.filter((questionId) => {
        let question = questions.find((question) => question.id === questionId);
        let answer = answers?.find((answer) => answer.questionId === questionId);
        if (!question || answer) return false;
        else return true;
      })
    );
  }, [section_add, questions, answers]);

  let section_questions_add_unwritten = React.useMemo(() => {
    return (id === undefined) ? undefined : (
      <>
          {section_unwritten_questions_add?.map((questionId, key) => {
            let question = questions?.find((question) => question.id === questionId);
            return (
              <NoteQuestion question = {question} written = {false} type = {'add'} order = {-1}/>
            );
          })}
      </>
    );
  }, [section_written_questions_add, block]);

  let written_questions_add = React.useMemo(() => {
    return (
      <>
        {questions?.map((question) => {
          let answer = answers?.find((answer) => answer.questionId === question.id);
          if (!answer || answer.book !== 0) return <> </>;
          else return (
            <NoteQuestion question = {question} written = {true} type = {'add'} order = {-1} />
          );
        })}
      </>
    );
  }, [questions, answers]);


  React.useEffect(() => {
      setScrollActive(scroll >= 137);
  }, [scroll]);

  if (!user.loggedIn) return <Redirect to='/login' />;
  else return (
    <>
      <Header additionalClass = '' />
      <div className = 'MementoNoteBook'>
          <div className = {'leftbar_container short'}>
              <NoteLeftBar additionalClass = {(scroll > 112 ? ' fixed' : '')} id = {id} book = {true} category = {false}/>
          </div>
          <div className = 'block note_book_page'>
              <div className = 'book_container margin_base'>
                  <div className = 'category_container'>
                      <Link to={`/notebook/0`}><div className = {'category NS px12 line25 bold' + (id === 0 ? ' op7' : ' op4')}>{'전체'}</div></Link>
                      {sections?.map((section, key) =>{
                        return (
                          <Link to={`/notebook/${key + 1}`}><div className = {'category NS px12 line25 bold' + (id === (key + 1) ? ' op7' : ' op4')}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div></Link>
                        );
                      })}
                  </div>
                  <div className = 'book_main'>
                      <div className = 'side_bar_container'>
                          <img className = 'zoom_button' src = {imageUrl('NotePage/zoom_image.png')} />
                          <img className = 'add_button' src = {imageUrl('NotePage/add_image.png')} onClick = {() => setAddQuestions(true)}/>
                          <div className = 'title GB px13 line30'>{'나의 아이들에게 남기는 이야기'}</div>
                          <img className = 'edit_button' style = {{margin: '483px 0px 0px 0px'}} src = {imageUrl('NotePage/edit_image.png')} />
                      </div>
                      <div className = 'left page'>

                      </div>
                      <div className = 'right page'>

                      </div>
                  </div>
              </div>
          </div>
          <div className = 'block note_book_page'>
              <div className = 'submenu_container'>
                  <div className = 'searchContainer'>
                      <img src = {imageUrl('search_image.png')} />
                      <input autoComplete='search_word' onChange={(e) => { setSearch_word(e.target.value) } } value={search_word} placeholder = '예)감동'/>
                  </div>
                  <div className = 'button_container'>
                      <img className = 'block_button' src = {imageUrl('ContentPage/block_button.svg')} onClick = {() => setBlock(!block)}/>
                      <img src = {imageUrl('NotePage/sort_image.png')} />
                      <img src = {imageUrl('NotePage/add_image_.png')} onClick = {() => setAddQuestions(true)}/>
                  </div>
              </div>
              <div className = 'written_question margin_note' style = {{marginTop: '-23px'}}>
                  <div className = 'questions_container'>
                      {(id === 0 ? questions_written : section_questions_written)}
                  </div>
              </div>
          </div>
          {addQuestions && <div className = 'block fixed'>
              <div className = 'add_questions_container margin_base'>
                  <div className = 'category_container'>
                      <div className = {'category NS px12 line25 bold' + (addSectionId === 0 ? ' whiteop10' : ' whiteop7')} onClick = {() => setAddSectionId(0)}>{'전체'}</div>
                      {sections?.map((section, key) =>{
                        return (
                          <div className = {'category NS px12 line25 bold' + (addSectionId === (key + 1) ? ' whiteop10' : ' whiteop7')} onClick = {() => {setAddSectionId(key + 1);}}>{section.tag.split("#").slice(1).map((tag) => (<span>{tag}</span>))}</div>
                        );
                      })}
                  </div>
                  <img src = {imageUrl('NotePage/quit_vector.svg')} style = {{position: 'absolute', right: '0px', top: '0px'}} onClick = {() => setAddQuestions(false)}/>
                  <div className = 'questions_container' style = {{margin: '20px 0px 0px 0px', gap: '30px'}}>
                      {(addSectionId === 0 ? written_questions_add : section_questions_add_written)}
                  </div>
                  {section_written_questions_add?.length === 0 && <>
                      <div className = 'empty_answered_question'>
                          <div className = 'text NS px14 line25 whiteop10'>현재 카테고리에 남은 질문이 존재하지 않습니다.</div>
                          <div className = 'text NS px14 line25 whiteop10'>{(section_unwritten_questions_add?.length !== 0 ? '아래의 질문에 대해 답변한 후, 유언 자서전에 추가해보는 것은 어떨까요?' : `추가 질문은 매주 '월요일'에 업로드 됩니다. 감사합니다!`)}</div>
                      </div>
                      <div className = 'questions_container' style = {{marginTop: '66px', marginLeft: '0px'}}>
                          {section_questions_add_unwritten}
                      </div>
                  </>}
                  <div className = 'add_button_container'>
                      {(section_written_questions_add?.length !== 0 || !(addSectionId === 0)) && <button className = 'category_total NS px14 bold whiteop10' onClick = {() => setCategoryTotal(!categoryTotal)}>카테고리 전체 질문 추가하기</button>}
                      {categoryTotal && <div className = 'category_total_container'>
                          <div className = 'text NS px14 line25 whiteop10 nospacing' style = {{height: '46px'}}>
                            <div>현재 카테고리의 작성된 질문을</div>
                            <div>모두 추가하시겠습니까?</div>
                          </div>
                          <button className = 'cancel NS px12 bold whiteop10' onClick = {() => setCategoryTotal(false)}>취소하기</button>
                          <button className = 'add NS px12 bold whiteop10'>추가하기</button>
                      </div>}
                      <button className = 'total NS px14 bold whiteop10' onClick = {() => setTotal(!total)}>전체 질문 추가하기</button>
                      {total && <div className = 'total_container'>
                          <div className = 'text NS px14 line25 whiteop10 nospacing' style = {{height: '46px'}}>
                            <div>메멘토 노트에 작성된 질문을</div>
                            <div>모두 추가하시겠습니까?</div>
                          </div>
                          <button className = 'cancel NS px12 bold whiteop10' onClick = {() => setTotal(false)}>취소하기</button>
                          <button className = 'add NS px12 bold whiteop10'>추가하기</button>
                      </div>}
                  </div>
              </div>
          </div>}
      </div>
    </>
  );
}

export default MementoNoteBook;
