# Sidebar 데이터 흐름 — 학습 정리 (layout → Store → MainLayout → API → Controller → Service → Mapper → XML → DB)

> **프로젝트:** hospital-project (Next.js) + hospital-backend (Spring Boot)  
> **핵심 API:** `GET http://localhost:8081/api/menus`  
> **DB 테이블:** `CMH.AUTH_MENU`

이 문서는 `npm run dev` 이후 화면이 뜨고, Sidebar 메뉴가 DB에서 로드되어 표시되기까지의 **전체 흐름**과, 학습 중 나온 **질문·오해·정리**를 빠짐없이 모아 둔 것이다.

---

## 1. 전체 흐름 한눈에

```
layout.tsx
  └─ Providers.tsx          (Redux store 연결)
       └─ MainLayout.tsx    (Sidebar + Nav + 페이지)
            └─ Sidebar.tsx  (useEffect → dispatch)
                 └─ Redux Saga → SidebarApi
                      └─ HTTP GET /api/menus
                           └─ MenuController.getMenus()
                                └─ MenuService.getMenuTree()
                                     └─ MenuMapper.selectAllMenus()
                                          └─ MenuMapper.xml (SELECT)
                                               └─ Oracle CMH.AUTH_MENU
                      ← JSON [MenuNodeDto...]
                 ← fetchSidebarSuccess → items
            ← Sidebar re-render → SidebarItem 목록 표시
```

**방향:** 프론트에서 `dispatch`로 시작 → HTTP로 백엔드 → DB 조회 → JSON으로 역순 복귀 → Redux `items` → 화면 render.

---

## 2. 프론트엔드 — layout부터 Sidebar까지

### 2-1. `layout.tsx` (Next.js Root Layout)

**파일:** `src/app/layout.tsx`

- Next.js App Router의 **최상위 layout**
- `<html>`, `<body>` 감싸고, 모든 페이지에 공통으로 적용
- `children` = **현재 URL에 해당하는 page component** (예: `/` page, `/patients` page)

```tsx
<Providers>
  <MainLayout>{children}</MainLayout>
</Providers>
```

- Sidebar는 여기 **없음**
- `children`은 page만. Sidebar는 MainLayout이 직접 mount

---

### 2-2. `Providers.tsx` (Redux + MUI 연결)

**파일:** `src/app/Providers.tsx`

- `"use client"` — client component
- **Store를 만드는 곳이 아님.** `Store.ts`에서 만든 `store`를 `<Provider store={store}>`로 **연결**만 함
- `children` = `<MainLayout>{page}</MainLayout>` (layout.tsx에서 넘어온 것)

```tsx
<Provider store={store}>{children}</Provider>
```

- 이 아래 component들만 `useDispatch`, `useSelector` 사용 가능

---

### 2-3. `Store.ts` (Redux store + Saga 실행)

**파일:** `src/store/Store.ts`

- `configureStore`로 store 생성
- `reducer`: `nav`, `sidebar`
- `sagaMiddleware` 등록 후 `sagaMiddleware.run(rootSaga)` — **앱 시작 시 saga 감시 시작**
- `RootSaga.ts` → `watchSidebarSaga` → `fetchSidebarRequest` action을 기다림

---

### 2-4. `MainLayout.tsx` (Sidebar mount)

**파일:** `src/components/layout/MainLayout.tsx`

- **Sidebar가 붙는 위치**
- `children` = **page content만** (Nav 아래 `<main>` 안)
- Sidebar는 `children`이 아니라 **`<Sidebar />`를 직접 render**

```tsx
<Sidebar width={SIDEBAR_WIDTH} />
...
<Box component="main">{children}</Box>
```

---

### 2-5. `Sidebar.tsx` (useEffect → dispatch → 화면)

**파일:** `src/components/sidebar/Sidebar.tsx`

#### mount 시 데이터 요청

```tsx
React.useEffect(() => {
  dispatch(fetchSidebarRequest());
}, [dispatch]);
```

- Sidebar가 **화면에 올라온 직후** 1번 실행
- `dispatch(fetchSidebarRequest())` → Redux action 발행

#### Redux state 구독

```tsx
const { items, loading, error } = useSelector(
  (state: RootState) => state.sidebar,
);
```

- `items` 바뀌면 component **re-render**

#### 화면 분기

| state | 화면 |
|-------|------|
| `loading === true` | CircularProgress (로딩) |
| `error` 있음 | 에러 메시지 |
| `items.length === 0` | "표시할 메뉴가 없습니다." |
| `items` 있음 | `items.map` → `<SidebarItem />` |

---

### 2-6. Redux Slice — action → state 변경

**파일:** `src/features/sidebar/SidebarSlice.ts`

| action | state 변화 |
|--------|------------|
| `fetchSidebarRequest` | `loading = true`, `error = null` |
| `fetchSidebarSuccess(items)` | `loading = false`, `items = payload` |
| `fetchSidebarFailure(msg)` | `loading = false`, `error = msg` |

- `fetchSidebarSuccess` = **성공 처리** (loading 끔 + items 채움). "success false"가 아님.

---

### 2-7. Saga — API 호출 담당

**파일:** `src/features/sidebar/SidebarSaga.ts`

```ts
function* fetchSidebarSaga() {
  try {
    const items: SidebarItem[] = yield call(fetchSidebarApi);
    yield put(fetchSidebarSuccess(items));
  } catch {
    yield put(fetchSidebarFailure("사이드바 로드 실패"));
  }
}
```

- `takeLatest(fetchSidebarRequest.type, fetchSidebarSaga)` — request action 올 때마다 saga 실행
- `yield call(fetchSidebarApi)` — API function 호출, **return 값**(`response.data`)을 `items`에 받음
- 성공 → `put(fetchSidebarSuccess(items))`
- 실패 → `put(fetchSidebarFailure(...))`

---

### 2-8. API — HTTP 요청

**파일:** `src/lib/api/SidebarApi.ts`, `src/lib/Axios.ts`

```ts
// Axios.ts
baseURL: "http://localhost:8081"

// SidebarApi.ts
const response = await api.get<SidebarItem[]>("/api/menus");
return response.data;
```

- 프론트는 **`getMenus`라는 이름을 모름**
- **`GET http://localhost:8081/api/menus`** URL만 호출
- `response.data` = JSON 배열 → Saga → Redux `items`

---

## 3. 프론트 타임라인 (시간 순)

```
[1] npm run dev → layout render
[2] Providers → store 연결
[3] MainLayout → Sidebar mount
[4] Sidebar useEffect → dispatch(fetchSidebarRequest)
[5] Slice: loading = true → Sidebar 로딩 UI
[6] Saga: fetchSidebarApi() → GET /api/menus
[7] (백엔드 처리 — 아래 4장)
[8] Saga: fetchSidebarSuccess(items)
[9] Slice: loading = false, items = [...]
[10] useSelector → Sidebar re-render
[11] items.map → SidebarItem 목록 표시
```

---

## 4. 백엔드 — Controller → Service → Mapper → XML → DB

### 4-1. `MenuController.java`

**파일:** `hospital-backend/.../MenuController.java`

```java
@RestController
@RequestMapping("/api/menus")
public class MenuController {

    public List<MenuNodeDto> getMenus() {
        return menuService.getMenuTree();
    }
}
```

| annotation | 역할 |
|------------|------|
| `@RestController` | REST API. return 값 → JSON |
| `@RequestMapping("/api/menus")` | URL prefix |
| `@GetMapping` | HTTP GET request 처리 |
| `@CrossOrigin` | localhost:3000 브라우저 요청 허용 (CORS) |

#### Q. `getMenus`는 어디서 나온 이름인가?

- **프론트에서 온 게 아님.** 개발자가 Controller에 **직접 만든 Java method 이름**
- 프론트 `fetchSidebarApi()` ↔ 백엔드 `getMenus()` — **이름으로 연결되지 않음**
- 연결 고리는 **`GET + /api/menus` URL** 뿐
- method 이름을 `loadMenu()`로 바꿔도 URL mapping은 동일하면 동작

#### Q. Spring이 Controller method 이름 보고 Service에서 자동으로 찾아주나?

- **아니오.**
- Spring이 하는 일:
  1. HTTP `GET /api/menus` → `getMenus()` 실행 (annotation 기준)
  2. `MenuService` object 주입 (DI)
- `menuService.getMenuTree()` — **개발자가 Controller 안에 직접 적은 Java 호출**
- Service method 이름과 Controller method 이름 **자동 매칭 없음**

#### Q. Service 갔다가 Controller로 와서 getMenus를 다시 호출하나?

- **아니오. 한 번만 타는 직선 호출.**

```
Spring → getMenus() 시작 (1번만)
  → menuService.getMenuTree() 호출 (함수 안에서 다른 함수 호출)
  → getMenuTree() 끝나면 return 값이 getMenus()의 return으로 복귀
  → getMenus() return
  → Spring이 JSON response
```

- `getMenus()` **재호출 없음**
- Controller = 문지기: request 받고 → Service 1번 호출 → 결과 return

---

### 4-2. `MenuService.java`

```java
public List<MenuNodeDto> getMenuTree() {
    return buildTreeFromFlatList(menuMapper.selectAllMenus());
}
```

#### Q. `getMenuTree()` 하면 List를 받나?

- **맞다.** return 타입 = **`List<MenuNodeDto>`**
- `List` = Java 목록 (TS의 배열 비슷)
- `<MenuNodeDto>` = 그 목록 안 원소 타입 = 메뉴 1칸 object
- 루트 메뉴만 List에 들어 있고, 자식은 각 node의 `children` 안에 또 List로 중첩

#### Q. `List<MenuNodeDto>` / Java 문법 정리

```java
public List<MenuNodeDto> getMenuTree()
```

| 부분 | 의미 |
|------|------|
| `public` | Controller 등 밖에서 호출 가능 |
| `List<MenuNodeDto>` | return 타입 — MenuNodeDto object 여러 개 담긴 목록 |
| `getMenuTree()` | method 이름, 인자 없음 |
| `return ...` | List<MenuNodeDto>를 돌려줌 |

**안쪽 실행 (안쪽부터):**

```
menuMapper.selectAllMenus()  →  List<Menu>      (DB 평면 row)
buildTreeFromFlatList(...)   →  List<MenuNodeDto> (트리 변환)
getMenuTree() return         →  List<MenuNodeDto>
```

#### 타입이 바뀌는 지점

| 단계 | return 타입 | 내용 |
|------|-------------|------|
| `selectAllMenus()` | `List<Menu>` | DB row 평면, parentId/sortOrder 있음, children 없음 |
| `buildTreeFromFlatList()` | `List<MenuNodeDto>` | API용 트리, children 중첩 |
| `getMenuTree()` | `List<MenuNodeDto>` | 위 결과 그대로 return |

#### `buildTreeFromFlatList` 요약

1. **1pass:** 각 `Menu` → `MenuNodeDto` 변환, Map(id → node)에 저장
2. **2pass:** `parentId == null` → roots에 추가, 아니면 부모의 `children`에 추가
3. **sortOrder**로 형제 메뉴 정렬
4. `List<MenuNodeDto> roots` return

---

### 4-3. `MenuMapper.java` + `MenuMapper.xml`

#### Q. XML에서 SELECT한 List를 selectAllMenus가 List<Menu>로 return하나?

- **맞다.**
- 단, "XML이 Java에 넘긴다"기보다 **`selectAllMenus()` 호출 시 MyBatis가 XML SQL 실행 → List<Menu> 생성 → return**

#### Q. 실행은 Service에서 하는데 Mapper.java는 언제 들어가나?

| 파일 | 역할 |
|------|------|
| **MenuMapper.java** | interface — `selectAllMenus()` **있다** + `List<Menu>` return **선언만** (body 없음) |
| **MenuMapper.xml** | 실제 **SELECT SQL** |
| **MyBatis** | java method 이름 ↔ xml `id` **짝 맞춰 구현체(proxy) 자동 생성** |
| **MenuService** | `menuMapper.selectAllMenus()` **호출** |

```
MenuService.getMenuTree()
  → menuMapper.selectAllMenus()     ← java interface 호출 (입구)
  → MyBatis proxy
  → MenuMapper.xml SELECT 실행      ← 실제 DB work
  → row마다 Menu object 생성
  → List<Menu> return
  → buildTreeFromFlatList(...)
```

- Service는 **XML을 직접 모름**
- **`MenuMapper` interface만** 알고 호출
- java = **버튼**, xml = **버튼 눌렀을 때 돌아가는 SQL**

#### MenuMapper.java

```java
@Mapper
public interface MenuMapper {
    List<Menu> selectAllMenus();
}
```

#### MenuMapper.xml

```xml
<mapper namespace="com.hospital.menu.MenuMapper">
    <select id="selectAllMenus" resultType="com.hospital.menu.Menu">
        SELECT MENU_ID AS id, PARENT_ID AS parentId, ...
        FROM CMH.AUTH_MENU
        WHERE IS_ACTIVE = 'Y'
        ORDER BY SORT_ORDER
    </select>
</mapper>
```

| Java | XML | 연결 |
|------|-----|------|
| `com.hospital.menu.MenuMapper` | `namespace="com.hospital.menu.MenuMapper"` | 같은 mapper |
| `selectAllMenus()` | `id="selectAllMenus"` | 같은 method |
| `List<Menu>` | `resultType="com.hospital.menu.Menu"` | row → Menu object |

#### Q. selectAllMenus() 함수 안에 배열이 박혀 있나?

- **아니오.** Java 소스에 하드코딩된 배열 없음
- **Oracle DB `CMH.AUTH_MENU`** 에서 SQL로 **그때그때 조회**해서 List 생성

**List<Menu> 예 (평면):**

```
[
  Menu(id=1, parentId=null, name="대시보드"),
  Menu(id=2, parentId=null, name="환자 관리"),
  Menu(id=3, parentId=2,    name="환자 목록")
]
```

---

### 4-4. `Menu` vs `MenuNodeDto`

| | Menu | MenuNodeDto |
|---|------|-------------|
| 용도 | DB ↔ MyBatis 매핑 | API JSON ↔ 프론트 SidebarItem |
| parentId, sortOrder | **있음** | **없음** (트리 만든 뒤 제외) |
| children | **없음** | **있음** (`List<MenuNodeDto>`) |
| 프론트까지 | Service 내부만 | JSON으로 내려감 |

---

### 4-5. JSON response → 프론트

Controller `getMenus()` return → Spring Jackson → JSON array:

```json
[
  {
    "id": 2,
    "code": "PATIENT",
    "name": "환자 관리",
    "path": null,
    "icon": "People",
    "children": [
      {
        "id": 3,
        "code": "PATIENT_LIST",
        "name": "환자 목록",
        "path": "/patients",
        "icon": null,
        "children": []
      }
    ]
  }
]
```

- 프론트 `fetchSidebarApi()` → `response.data` = 이 배열
- Saga → `fetchSidebarSuccess(items)` → Redux `items`
- Sidebar → `SidebarItem` render

---

## 5. 백엔드 타임라인 (시간 순)

```
[1] GET /api/menus (Origin: localhost:3000)
[2] Spring: MenuController.getMenus() 실행 (1번만)
[3] menuService.getMenuTree() 호출
[4] menuMapper.selectAllMenus() 호출
[5] MyBatis → MenuMapper.xml SELECT
[6] CMH.AUTH_MENU row → Menu object → List<Menu>
[7] buildTreeFromFlatList(List<Menu>) → List<MenuNodeDto>
[8] getMenuTree() → getMenus() return
[9] Spring → JSON HTTP 200 response
[10] 프론트 Axios → Saga → Redux → Sidebar render
```

---

## 6. 호출 스택 (Java — 위에서 아래로, return으로 복귀)

```
Spring (HTTP)
  └─ MenuController.getMenus()
       └─ MenuService.getMenuTree()
            └─ MenuMapper.selectAllMenus()  [MyBatis → XML → DB]
            └─ MenuService.buildTreeFromFlatList()
       ← List<MenuNodeDto>
     ← List<MenuNodeDto>
  ← JSON response
```

---

## 7. 이름·연결 정리표

| 이름 | 어디 | 프론트/백 연결 |
|------|------|----------------|
| `fetchSidebarApi` | 프론트 SidebarApi.ts | HTTP GET `/api/menus` |
| `getMenus` | 백엔드 Controller | URL + @GetMapping (이름 무관) |
| `getMenuTree` | 백엔드 Service | Controller Java 코드에서 **직접 호출** |
| `selectAllMenus` | 백엔드 Mapper | Service Java 코드에서 **직접 호출** |
| `fetchSidebarRequest` | Redux action | Sidebar useEffect dispatch |
| `fetchSidebarSuccess` | Redux action | Saga put, items 채움 |

**프론트 function 이름 ↔ 백엔드 method 이름 = 연결 없음.**  
**HTTP URL `/api/menus`만 연결.**

---

## 8. children prop 정리 (layout / Providers / MainLayout)

| component | `children`가 가리키는 것 |
|-----------|--------------------------|
| `layout.tsx` | 현재 **page** |
| `Providers.tsx` | `<MainLayout>{page}</MainLayout>` |
| `MainLayout.tsx` | **page content만** (Sidebar·Nav 제외) |

Sidebar는 **MainLayout이 `<Sidebar />`로 직접 mount.**

---

## 9. 관련 파일 목록

### 프론트 (hospital-project)

| 파일 | 역할 |
|------|------|
| `src/app/layout.tsx` | Root layout, Providers + MainLayout |
| `src/app/Providers.tsx` | Redux Provider, MUI Theme |
| `src/store/Store.ts` | store 생성, saga run |
| `src/store/RootSaga.ts` | saga 통합 |
| `src/components/layout/MainLayout.tsx` | Sidebar + Nav + page |
| `src/components/sidebar/Sidebar.tsx` | useEffect dispatch, items render |
| `src/features/sidebar/SidebarSlice.ts` | loading/items/error state |
| `src/features/sidebar/SidebarSaga.ts` | API 호출, success/failure put |
| `src/lib/api/SidebarApi.ts` | GET /api/menus |
| `src/lib/Axios.ts` | baseURL localhost:8081 |

### 백엔드 (hospital-backend)

| 파일 | 역할 |
|------|------|
| `MenuController.java` | GET /api/menus, JSON response |
| `MenuService.java` | List<Menu> → List<MenuNodeDto> 트리 변환 |
| `MenuMapper.java` | selectAllMenus interface 선언 |
| `MenuMapper.xml` | AUTH_MENU SELECT SQL |
| `Menu.java` | DB row 매핑 entity |
| `MenuNodeDto.java` | API JSON 1 node |
| `WebConfig.java` | CORS 설정 |

---

## 10. 한 줄 요약

**layout → Providers(store 연결) → MainLayout(Sidebar mount) → Sidebar useEffect dispatch → Saga → GET /api/menus → Controller.getMenus → Service.getMenuTree → Mapper.selectAllMenus → XML SELECT → DB → List<Menu> → 트리 변환 → List<MenuNodeDto> → JSON → Redux items → Sidebar 화면.**
