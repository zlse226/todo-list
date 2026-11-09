"use client";

import { useEffect, useState } from "react";
import Button from "./components/Button";
import TodoCheckbox from "./components/TodoCheckbox";

import plusIcon from "../public/images/ic/Property 1=plus.png";
import todoIcon from "../public/images/img/todo.svg";
import doneIcon from "../public/images/img/done.svg";
import todoEmptyImg from "../public/images/img/Type=Todo, Size=Large.svg";
import doneEmptyImg from "../public/images/img/Type=Done, Size=Large.svg";
import styles from "../app/page.module.css";
import "./globals.css";

type Todo = {
  id: number,
  name: string;
  isCompleted: boolean;
};

// const todos: Todo[] = [
//   // { id: 1, name: "비타민 챙겨먹기", isCompleted: true},
//   // { id: 2, name: "책 읽기", isCompleted: false},
// ];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // [할일 목록 추가]
  const [todoName, setTodoName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // [상태 변경]
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");


  // [할일 목록 추가]
  async function handleAddTodo() {

  const name = todoName.trim();
  if (!name || isAdding || isLoading || error) return;

  setIsAdding(true);
  setAddError("");

  try {
    const response = await fetch(
      "https://assignment-todolist-api.vercel.app/api/zlse226/items",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      },
    );

    if (!response.ok) {
      throw new Error(`할 일 추가 실패 (${response.status})`);
    }

    const newTodo: Todo = await response.json();
    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setTodoName("");
  } catch {
    setAddError("할 일을 추가하지 못했어요. 다시 시도해 주세요.");
  } finally {
    setIsAdding(false);
  }
}

// [todo <-> done 상태변경]
async function handleToggleTodo(todo: Todo) {
  if (isUpdating) return;

  // 진행 중이면 완료로, 완료 상태면 진행 중으로 변경
  const isCompleted = !todo.isCompleted;
  setIsUpdating(true);
  setUpdateError("");

  try {
    // 클릭한 할 일의 ID로 완료 상태를 서버에 저장
    const response = await fetch(
      `https://assignment-todolist-api.vercel.app/api/zlse226/items/${todo.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      },
    );

    if (!response.ok) {
      throw new Error(`상태 변경 실패 (${response.status})`);
    }

    // 저장에 성공하면 클릭한 항목의 상태만 변경
    setTodos((currentTodos) =>
      currentTodos.map((item) =>
        item.id === todo.id ? { ...item, isCompleted } : item,
      ),
    );
  } catch {
    setUpdateError("할 일 상태를 바꾸지 못했어요. 다시 시도해 주세요.");
  } finally {
    setIsUpdating(false);
  }
}

  //  10개씩 여러 페이지를 불러와 전체 할 일 목록을 보여줌
  useEffect(() => {
  const controller = new AbortController();

  async function loadTodos() {
    try {
      const allItems: Todo[] = [];
      const pageSize = 10;

      for (let page = 1; ; page += 1) {
        const response = await fetch(
          `https://assignment-todolist-api.vercel.app/api/zlse226/items?page=${page}&pageSize=${pageSize}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`목록 조회 실패 (${response.status})`);
        }

        const items: Todo[] = await response.json();
        allItems.push(...items);

        if (items.length < pageSize) {
          break;
        }
      }

      setTodos(allItems);
    } catch {
      if (!controller.signal.aborted) {
        setError("할 일 목록을 불러오지 못했어요.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  void loadTodos();
  return () => controller.abort();
}, []);

  // 진행중
  const pendingTodos = todos.filter((todo) => !todo.isCompleted);
  // 완료
  const doneTodos = todos.filter((todo) => todo.isCompleted);

  return (
    <> 
    {/* 헤더 공용 컴포넌트 <Header/> => layout.tsx에 적용 */}
    <main className={styles.main}>

      <form className={styles.todoAdd}onSubmit={(event) => {
          event.preventDefault(); void handleAddTodo();
        }}>
        <input type="text" placeholder="할 일을 입력해주세요" aria-label="새 할 일" value={todoName}
          onChange={(event) => setTodoName(event.target.value)} disabled={isAdding}/>
        {/* 버튼 공용 컴포넌트 */}
        <Button className={todos.length === 0 ? `${styles.todoAddBtn} ${styles.todoAddBtnEmpty}` : styles.todoAddBtn}
          type="submit" aria-label="할 일 추가" 
          disabled={isLoading || Boolean(error) || isAdding || !todoName.trim()}>
          <img className={styles.todoAddIcon} src={plusIcon.src} alt=""/>
          <span className={styles.todoAddLabel}>추가하기</span>
        </Button>
      </form>
      {addError && <p role="alert">{addError}</p>}
      {updateError && <p role="alert">{updateError}</p>} {/* 상태변경 오류표시 */}
      {isLoading ? (
        <p role="status">할 일 목록을 불러오는 중이에요.</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
      <div className={styles.todoColumns}>
        {/* TO DO */}
        <section className={styles.todoSection}>
          <h2><img src={todoIcon.src} alt="to do" /></h2>
          {pendingTodos.length === 0 ? (
            <div className={styles.todoEmpty}>
              <img src={todoEmptyImg.src} alt="" />
              <p>할 일이 없어요.<br />TODO를 새롭게 추가해주세요!</p>
            </div>
          ) : (
            <ul className={styles.todoList}>
              {pendingTodos.map((todo) => (
                <li className={styles.todoItem} key={todo.id}>
                  <TodoCheckbox
                    isCompleted={todo.isCompleted}
                    onToggle={() => void handleToggleTodo(todo)}
                    disabled={isUpdating}/>
                  <a className={styles.todoItemText} href={`/items/${todo.id}`}>
                    {todo.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
        {/* DONE */}
        <section className={styles.doneSection}>
          <h2><img src={doneIcon.src} alt="done" /></h2>
          {doneTodos.length === 0 ? (
            <div className={styles.todoEmpty}>
              <img src={doneEmptyImg.src} alt="" />
              <p>아직 다 한 일이 없어요.<br />해야 할 일을 체크해보세요!</p>
            </div>
          ) : (
            <ul className={styles.todoList}>
              {doneTodos.map((todo) => (
                <li className={styles.todoItem} key={todo.id}>
                  <TodoCheckbox
                    isCompleted={todo.isCompleted}
                    onToggle={() => void handleToggleTodo(todo)}
                    disabled={isUpdating}/>
                  <a className={styles.todoItemText} href={`/items/${todo.id}`}>
                    {todo.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      )}
    </main>
    </>
  );
}
