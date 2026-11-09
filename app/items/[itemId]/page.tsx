"use client";

import { Suspense, useEffect, useState, type ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation"; // 주소에서 itemId 가져오기

import Button from "../../components/Button";
import TodoCheckbox from "../../components/TodoCheckbox";

import detailMemo from "../../../public/images/img/memo.svg";
import detailEmptyImg from "../../../public/images/ic/img.svg";
import detailPlusImg from "../../../public/images/Type=Plus.svg";
import detailEditImg from "../../../public/images/Type=Edit.svg";
import SaveIcon from "../../../public/ic/check.svg";
import DeletIcon from "../../../public/ic/X.svg";

import styles from "./page.module.css";

function ItemDetailContent() {
    // 선택한 이미지를 화면에 보여줄 주소
    const [imageUrl, setImageUrl] = useState("");

    // 나중에 API로 업로드할 원본 파일
    const [imageFile, setImageFile] = useState<File | null>(null);

    // 수정할 제목과 메모를 보관
    const [name, setName] = useState("");
    const [memo, setMemo] = useState("");
    // true면 완료, false면 진행 중
    const [isCompleted, setIsCompleted] = useState(false);

    // 주소가 /items/12라면 itemId는 "12"
    const { itemId } = useParams<{ itemId: string }>();

    // 저장 후 목록으로 이동하고, 중복 클릭을 막아요.
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // 상세 조회 상태
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
    const controller = new AbortController();

    async function loadItem() {
        try {
        const response = await fetch(
            `https://assignment-todolist-api.vercel.app/api/zlse226/items/${itemId}`,
            { signal: controller.signal },
        );

        if (!response.ok) {
            throw new Error("할 일을 불러오지 못했어요.");
        }

        const item = await response.json();

        // API에서 받은 기존 제목과 메모를 입력칸에 넣음
        setName(item.name);
        setMemo(item.memo ?? "");

        //  API에 저장된 완료 상태와 이미지 URL
        setIsCompleted(item.isCompleted);
        setImageUrl(item.imageUrl ?? "");
        } catch {
        if (!controller.signal.aborted) {
            // 조회에 실패하면 화면에 오류 표시
            setLoadError("할 일을 불러오지 못했어요.");
            }
        }finally {
        if (!controller.signal.aborted) {
            // 👇 조회가 끝난 뒤 입력 화면 표시
            setIsLoading(false);
            }
        }
    }

    void loadItem();
    return () => controller.abort();
    }, [itemId]);



    // 이미지가 바뀌거나 페이지를 나갈 때 임시 주소 정리
    useEffect(() => {
    return () => {
        // 브라우저에서 만든 임시 주소만 정리
        if (imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
        }
    };
    }, [imageUrl]);

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    // 파일 선택을 취소하면 종료
    if (!file) return;

    // 이미지 파일이 아니면 선택을 취소해요.
    if (!file.type.startsWith("image/")) {
        alert("이미지 파일을 선택해 주세요.");
        event.target.value = "";
        return;
    }

    // 마지막 점 뒤의 확장자를 제외한 파일 이름
    const fileName = file.name.replace(/\.[^.]+$/, "");

    if (!/^[a-zA-Z]+$/.test(fileName)) {
    alert("이미지 파일 이름은 영문만 사용해 주세요.");
    event.target.value = "";
    return;
    }

    if (file.size > 5 * 1024 * 1024) {
    alert("이미지는 5MB 이하로 선택해 주세요.");
    event.target.value = "";
    return;
    }

    setImageUrl(URL.createObjectURL(file));
    // 선택한 원본 파일 보관
    setImageFile(file);
    }

    async function uploadImage(file: File) {
    // 파일을 API에 보낼 수 있는 형식으로 담음
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
        "https://assignment-todolist-api.vercel.app/api/zlse226/images/upload",
        {
        method: "POST",
        body: formData,
        },
    );

    if (!response.ok) {
        throw new Error("이미지 업로드에 실패했어요.");
    }

    // API가 돌려준 이미지 URL을 꺼냄
    const result: { url: string } = await response.json();
    return result.url;
    }


    async function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
        alert("할 일 이름을 입력해 주세요.");
        return;
    }

    if (isSaving) return;
    setIsSaving(true);

    try {
        // 새 파일이 있으면 먼저 업로드하고, 없으면 기존 이미지 URL 유지
        const savedImageUrl = imageFile
        ? await uploadImage(imageFile)
        : imageUrl || undefined;  // 이미지가 없으면 undefined로 두어 요청에서 제외

        // 제목, 메모, 완료 상태, 이미지 URL을 함께 저장
        const response = await fetch(
        `https://assignment-todolist-api.vercel.app/api/zlse226/items/${itemId}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            name: trimmedName,
            memo,
            isCompleted,
            imageUrl: savedImageUrl,
            }),
        },
        );

        if (!response.ok) {
        throw new Error("수정에 실패했어요.");
        }

        router.push("/"); // 저장 성공 후 목록으로 이동
    } catch {
        alert("저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
        setIsSaving(false);
    }
    }

    // 현재 할 일을 삭제하고 목록으로 이동
    async function handleDelete() {
    if (isSaving) return;
    setIsSaving(true);

    try {
        const response = await fetch(
        `https://assignment-todolist-api.vercel.app/api/zlse226/items/${itemId}`,
        {
            method: "DELETE",
        },
        );

        if (!response.ok) {
        throw new Error("삭제에 실패했어요.");
        }

        router.push("/"); // 삭제 성공 후 목록으로 이동
    } catch {
        alert("삭제하지 못했어요. 다시 시도해 주세요.");
    } finally {
        setIsSaving(false);
    }
}
    // 조회 중이거나 실패한 경우에는 입력 화면 대신 안내 표시
    if (isLoading) return <p>할 일을 불러오는 중이에요.</p>;
    if (loadError) return <p role="alert">{loadError}</p>;


  return (
    <main className={styles.main}>
        <div className={isCompleted ? `${styles.detailTitle} ${styles.detailCompleted}` : styles.detailTitle}>
            {/* 현재 상태와 클릭할 때 실행할 함수를 전달 */}
            <TodoCheckbox isCompleted={isCompleted} onToggle={() => setIsCompleted(!isCompleted)}/>
            <input className={styles.detailText} value={name} onChange={(event) => setName(event.target.value)} aria-label="할 일 이름"/>
        </div>
        <div className={styles.detailColumns}>
            <div className={styles.detailFile}>
                {imageUrl ? (
                    <img className={styles.detailPreview} src={imageUrl} alt="선택한 이미지" />
                    ) : (
                    <img className={styles.detailFileIcon} src={detailEmptyImg.src} alt="" />
                )}
                <label className={styles.detailFileBtn} htmlFor="imageFile">
                    <img src={imageUrl ? detailEditImg.src : detailPlusImg.src} alt=""/>
                </label>
                {/* 컴퓨터에서 파일 선택하는 요소 */}
                <input className={styles.detailFileInput} onChange={handleImageChange}
                    id="imageFile" type="file"accept="image/*" aria-label="이미지 선택"/>
            </div>
            <div className={styles.detailMemo}>
                <img src={detailMemo.src} alt=""/>
                <div className={styles.detailMemoContent}>
                    <p className={styles.detailMemoTitle}>Memo</p>
                    <textarea className={styles.detailMemoText} aria-label="메모" value={memo} onChange={(event) => setMemo(event.target.value)}/>
                </div>
            </div>
        </div>
        <div className={styles.detailBtnsBox}>
            <Button className={isCompleted ? styles.saveCompleted : ""} type="button" onClick={handleSave} disabled={isSaving}>
                <img src={SaveIcon.src} alt=""/>
                <span>수정완료</span>
            </Button>
            <Button className={styles.deleteBtn} type="button" onClick={handleDelete} disabled={isSaving}>
                <img src={DeletIcon.src} alt=""/>
                <span>삭제하기</span>
            </Button>
        </div>
    </main>
)
}
export default function ItemDetailPage() {
  return (
    <Suspense fallback={<p>할 일을 불러오는 중이에요.</p>}>
      <ItemDetailContent />
    </Suspense>
  );
}