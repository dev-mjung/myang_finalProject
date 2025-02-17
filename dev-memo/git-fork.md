### **원본 레포지토리의 변경사항을 내 레포지토리에 반영하면서 PR을 보내야 할까?** 🤔

📌 **결론:** **꼭 그런 건 아니지만, 원본과 동기화(Sync)하는 게 좋다!**

- 원본 레포가 자주 업데이트된다면 **내 Fork 레포를 최신 상태로 유지하는 게 중요**해.
- 그래야 **충돌(conflict)** 없이 PR을 보낼 수 있어.
- 하지만 PR을 보내는 시점에서 최신 상태라면 따로 머지할 필요는 없어.

---

## ✅ **PR을 보내기 전에 원본 레포 변경사항을 내 Fork 레포에 반영하는 방법**

원본이 업데이트된 상태에서 내 레포가 오래된 경우,  
다음 과정을 통해 최신 코드로 동기화(Sync)한 후 PR을 보내는 게 좋아.

### **1️⃣ 원본 레포를 내 로컬에 추가 (Upstream 설정)**

```bash
git remote add upstream https://github.com/원본-레포-소유자/원본-레포.git
```

- `upstream`은 원본 레포를 가리키는 이름이야.

### **2️⃣ 원본 레포의 최신 변경사항 가져오기**

```bash
git fetch upstream
```

- `fetch`는 원본(`upstream`)의 변경 사항을 가져오지만, 내 브랜치에는 적용되지 않아.

### **3️⃣ 내 `main` 브랜치에 원본 `main` 변경사항 합치기**

```bash
git checkout main
git merge upstream/main
```

- 원본의 `main` 브랜치를 내 `main` 브랜치에 병합.
- 충돌(conflict)이 생기면 직접 해결해야 함.

### **4️⃣ 최신 상태를 내 Fork 레포에도 반영 (GitHub로 Push)**

```bash
git push origin main
```

- 이 과정까지 하면 **내 Fork 레포의 main 브랜치가 원본과 동일한 상태가 됨**.

---

## ✅ **이제 새로운 기능을 개발한 후 PR 보내기**

동기화된 상태에서 새로운 기능을 개발하고 PR을 보내면 돼.

### **1️⃣ 새로운 브랜치 생성**

```bash
git checkout -b feature/my-new-feature
```

- 새로운 기능 개발을 위한 브랜치를 만든다.

### **2️⃣ 코드 수정 & 커밋 & Push**

```bash
git add .
git commit -m "새 기능 추가"
git push origin feature/my-new-feature
```

### **3️⃣ GitHub에서 PR 생성**

- GitHub에 가서 `Pull Request` 버튼을 클릭
- `base` 브랜치는 원본(`upstream`)의 `main`
- `compare` 브랜치는 내 Fork의 `feature/my-new-feature`
- PR 생성 후 팀원들과 코드 리뷰 진행

---

## ✅ **정리**

- **반드시 원본과 동기화한 후 PR을 보내야 하는 건 아니지만, 최신 상태를 유지하는 게 좋음!**
- 원본 레포 변경 사항을 내 Fork 레포에 반영하려면 `fetch → merge → push` 과정이 필요함.
- 최신 상태에서 새로운 브랜치를 만들어 개발한 후 PR을 보내면 **충돌 없이 원활한 협업이 가능**! 🚀

혹시 이해 안 가는 부분이나 더 궁금한 점 있으면 편하게 물어봐! 😊
