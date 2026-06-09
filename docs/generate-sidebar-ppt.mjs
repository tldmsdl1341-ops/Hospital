/**
 * sidebar-data-flow.md 기반 PPT 생성 (12단계 시퀀스 = Step 1~12)
 * 실행: node docs/generate-sidebar-ppt.mjs
 */
import PptxGenJS from "pptxgenjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "sidebar-data-flow.pptx");

const FONT = "Malgun Gothic";
const C = {
  title: "1E3A5F",
  accent: "2563EB",
  sub: "64748B",
  codeBg: "F1F5F9",
  dark: "0F172A",
};

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Hospital Project";
pptx.title = "사이드바 데이터 흐름 (12단계)";

/** mermaid 시퀀스 다이어그램과 1:1 대응하는 12단계 */
const SEQUENCE_12 = [
  { actor: "Browser → Sidebar", title: "컴포넌트 마운트", desc: "MainLayout이 Sidebar.tsx를 DOM에 올림", file: "MainLayout.tsx" },
  { actor: "Sidebar → Redux", title: "dispatch(fetchSidebarRequest)", desc: "useEffect 마운트 시 액션 1회 전송", file: "Sidebar.tsx" },
  { actor: "Redux → Saga", title: "takeLatest 감지", desc: "Slice loading=true + watcher가 worker 실행", file: "SidebarSlice.ts / SidebarSaga.ts" },
  { actor: "Saga → API", title: "yield call(fetchSidebarApi)", desc: "saga가 API 함수 Promise 실행 위임", file: "SidebarSaga.ts" },
  { actor: "API → Spring", title: "GET /api/menus", desc: "Axios cross-origin HTTP 요청", file: "SidebarApi.ts / Axios.ts" },
  { actor: "Spring → Service", title: "getMenuTree() 호출", desc: "Controller가 Service에 트리 조회 위임", file: "MenuController.java" },
  { actor: "Service → DB", title: "SELECT AUTH_MENU", desc: "MyBatis가 Oracle에서 평면 목록 조회", file: "MenuMapper.xml" },
  { actor: "DB → Service", title: "평면 List<Menu> 반환", desc: "IS_ACTIVE='Y' row 목록이 Java로 매핑", file: "Menu.java" },
  { actor: "Service → Spring", title: "계층 트리 MenuNodeDto[]", desc: "buildTree() 재귀로 parentId 기반 트리 구성", file: "MenuService.java" },
  { actor: "Spring → API", title: "JSON HTTP 200 응답", desc: "Jackson이 List<MenuNodeDto> → JSON 직렬화", file: "MenuNodeDto.java" },
  { actor: "API → Saga", title: "SidebarItem[] (response.data)", desc: "Axios가 JSON 파싱 후 .data만 return", file: "SidebarApi.ts" },
  { actor: "Saga → Redux → UI", title: "put(success) → items → 렌더", desc: "Redux 갱신 후 Sidebar/SidebarItem 표시", file: "SidebarSlice.ts / Sidebar.tsx" },
];

function addFooter(slide, text) {
  slide.addText(text, { x: 0.5, y: 5.15, w: 9, h: 0.3, fontSize: 9, color: C.sub, fontFace: FONT });
}

function titleSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.12, fill: { color: C.accent }, line: { color: C.accent } });
  slide.addText(title, { x: 0.6, y: 1.5, w: 8.8, h: 1.2, fontSize: 34, bold: true, color: C.title, fontFace: FONT });
  slide.addText(subtitle, { x: 0.6, y: 2.8, w: 8.8, h: 0.9, fontSize: 15, color: C.sub, fontFace: FONT });
  slide.addText("12단계 시퀀스 · hospital-project + hospital-backend · GET /api/menus", {
    x: 0.6, y: 4.4, w: 8.8, h: 0.4, fontSize: 12, color: C.accent, fontFace: FONT,
  });
  return slide;
}

function sectionSlide(num, title, desc, actor) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.title }, line: { color: C.title } });
  slide.addText(`Step ${String(num).padStart(2, "0")} / 12`, {
    x: 0.6, y: 1.5, w: 3, h: 0.45, fontSize: 13, color: "93C5FD", fontFace: FONT,
  });
  if (actor) {
    slide.addText(actor, {
      x: 0.6, y: 1.95, w: 8.8, h: 0.4, fontSize: 11, color: "64748B", fontFace: "Consolas",
    });
  }
  slide.addText(title, { x: 0.6, y: 2.45, w: 8.8, h: 1, fontSize: 30, bold: true, color: "FFFFFF", fontFace: FONT });
  slide.addText(desc, { x: 0.6, y: 3.55, w: 8.8, h: 1.2, fontSize: 14, color: "CBD5E1", fontFace: FONT });
  return slide;
}

function prepSection(title, desc) {
  const slide = pptx.addSlide();
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: "334155" }, line: { color: "334155" } });
  slide.addText("사전 준비", { x: 0.6, y: 1.7, w: 3, h: 0.4, fontSize: 13, color: "94A3B8", fontFace: FONT });
  slide.addText(title, { x: 0.6, y: 2.2, w: 8.8, h: 1, fontSize: 30, bold: true, color: "FFFFFF", fontFace: FONT });
  slide.addText(desc, { x: 0.6, y: 3.3, w: 8.8, h: 1.2, fontSize: 14, color: "CBD5E1", fontFace: FONT });
  return slide;
}

function contentSlide(title, bullets, code, note, footer) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 20, bold: true, color: C.title, fontFace: FONT });
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 0.85, w: 1.2, h: 0.05, fill: { color: C.accent }, line: { color: C.accent } });

  const hasCode = !!code;
  const bulletItems = bullets.map((t) => ({
    text: t,
    options: { bullet: true, breakLine: true, fontSize: 11, color: C.dark, fontFace: FONT },
  }));
  slide.addText(bulletItems, {
    x: 0.5, y: 1.05, w: hasCode ? 4.25 : 9, h: hasCode ? 3.9 : 3.6, valign: "top",
  });

  if (code) {
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 4.95, y: 1.05, w: 4.55, h: 3.65, fill: { color: C.codeBg }, line: { color: "E2E8F0", width: 1 },
    });
    slide.addText(code.label, { x: 5.1, y: 1.1, w: 4.3, h: 0.22, fontSize: 8, bold: true, color: C.accent, fontFace: "Consolas" });
    slide.addText(code.text, {
      x: 5.1, y: 1.35, w: 4.3, h: 3.25, fontSize: 8, color: C.dark, fontFace: "Consolas", valign: "top",
    });
  }

  if (note) {
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 4.55, w: 9, h: 0.52, fill: { color: "EFF6FF" }, line: { color: "BFDBFE", width: 1 },
    });
    slide.addText(`TIP  ${note}`, { x: 0.65, y: 4.62, w: 8.7, h: 0.42, fontSize: 9, color: C.accent, fontFace: FONT });
  }
  if (footer) addFooter(slide, footer);
  return slide;
}

function flowSlide(title, steps, startNum = 1) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 20, bold: true, color: C.title, fontFace: FONT });
  const rowH = 0.58;
  steps.forEach((step, i) => {
    const num = startNum + i;
    const y = 0.95 + i * rowH;
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.42, h: 0.42, fill: { color: C.accent }, line: { color: C.accent },
    });
    slide.addText(String(num), {
      x: 0.5, y, w: 0.42, h: 0.42, fontSize: 10, bold: true, color: "FFFFFF",
      align: "center", valign: "middle", fontFace: FONT,
    });
    slide.addText(step.actor, {
      x: 1.05, y: y - 0.02, w: 2.6, h: 0.22, fontSize: 8, color: C.accent, fontFace: "Consolas",
    });
    slide.addText(step.title, { x: 1.05, y: y + 0.12, w: 8.4, h: 0.22, fontSize: 11, bold: true, color: C.dark, fontFace: FONT });
    slide.addText(step.desc, { x: 1.05, y: y + 0.32, w: 8.4, h: 0.22, fontSize: 9, color: C.sub, fontFace: FONT });
  });
  return slide;
}

function tableSlide(title, headers, rows, colW, footer) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.5, fontSize: 20, bold: true, color: C.title, fontFace: FONT });
  const tableData = [
    headers.map((h) => ({
      text: h, options: { bold: true, fill: { color: C.title }, color: "FFFFFF", fontSize: 10, fontFace: FONT },
    })),
    ...rows.map((row) => row.map((cell) => ({ text: cell, options: { fontSize: 9, color: C.dark, fontFace: FONT } }))),
  ];
  slide.addTable(tableData, { x: 0.5, y: 1.0, w: 9, colW, border: { type: "solid", color: "E2E8F0", pt: 1 } });
  if (footer) addFooter(slide, footer);
  return slide;
}

// ═══════════════════════════════════════
// INTRO
// ═══════════════════════════════════════

titleSlide("사이드바 데이터 흐름", "npm run dev → 12단계 시퀀스 → Spring Boot → Oracle → UI");

contentSlide("문서 기준 12단계 시퀀스", [
  "sidebar-data-flow.md mermaid 다이어그램의 화살표 1개 = Step 1개",
  "이전 PPT는 7단계로 압축되어 Step 8~12가 빠져 있었음",
  "이번 버전: Step 01~12 각각 섹션 + 상세 슬라이드 2장씩",
  "사전 준비(서버 기동·Store 초기화)는 Step 이전 별도 구간",
], {
  label: "참여자 (Participants)",
  text:
    "Browser\nSidebar.tsx\nRedux Store\nSidebarSaga\nSidebarApi (Axios)\nMenuController\nMenuService\nOracle AUTH_MENU",
}, "Step 12는 Saga→Redux→Sidebar→Browser까지 UI 렌더까지 포함");

flowSlide("시퀀스 전체 — Step 01 ~ 06", SEQUENCE_12.slice(0, 6), 1);
flowSlide("시퀀스 전체 — Step 07 ~ 12", SEQUENCE_12.slice(6, 12), 7);

tableSlide("사전 준비 — 실행 환경", ["서버", "명령", "포트"], [
  ["프론트", "npm run dev", "3000"],
  ["백엔드", "HospitalApplication.main()", "8081"],
  ["DB", "Oracle XE", "1521"],
], [2.2, 3.8, 3], "Axios baseURL = http://localhost:8081  |  CORS = localhost:3000 허용");

// ═══════════════════════════════════════
// PRE-STEP (Step 전 준비)
// ═══════════════════════════════════════

prepSection("Step 0-A — npm run dev", "Next.js 개발 서버 기동 (Step 1 이전)");
contentSlide("Step 0-A — 프론트 서버", [
  "package.json scripts.dev → next dev 실행",
  "App Router(src/app) 번들링 후 localhost:3000 대기",
  "브라우저 접속 시 layout → Providers → MainLayout 렌더 시작",
], {
  label: "package.json",
  text: '"scripts": {\n  "dev": "next dev"\n}\n\n$ npm run dev\n→ http://localhost:3000',
});

prepSection("Step 0-B — Redux/Saga 초기화", "Store 생성 + watchSidebarSaga 등록 (Step 3 준비)");
contentSlide("Step 0-B — Store.ts / RootSaga.ts", [
  "Providers import store → sagaMiddleware.run(rootSaga) 즉시 실행",
  "sidebar 초기값: items=[], loading=false, error=null",
  "watchSidebarSaga가 fetchSidebarRequest.type 감시 대기",
  "thunk:false — 비동기는 saga만 담당",
], {
  label: "Store.ts + RootSaga.ts",
  text:
    "const sagaMiddleware = createSagaMiddleware();\nexport const store = configureStore({\n  reducer: { sidebar: sidebarReducer },\n  middleware: (g) =>\n    g({ thunk: false }).concat(sagaMiddleware),\n});\nsagaMiddleware.run(rootSaga);\n\nyield all([fork(watchSidebarSaga)]);",
}, "Step 3에서 takeLatest가 이 watcher를 통해 동작");

// ═══════════════════════════════════════
// STEP 01 ~ 12 (각 Step: section + detail)
// ═══════════════════════════════════════

// STEP 01
sectionSlide(1, SEQUENCE_12[0].title, SEQUENCE_12[0].desc, SEQUENCE_12[0].actor);
contentSlide("Step 01 — Sidebar 컴포넌트 마운트", [
  "RootLayout → Providers → MainLayout → <Sidebar width={240} />",
  "Sidebar는 layout에 고정 → 모든 페이지에서 항상 존재",
  "마운트 = React가 컴포넌트를 DOM에 처음 붙이는 순간",
  "다음 Step에서 useEffect가 실행됨",
], {
  label: "MainLayout.tsx + layout.tsx",
  text:
    "// layout.tsx\n<Providers>\n  <MainLayout>{children}</MainLayout>\n</Providers>\n\n// MainLayout.tsx\n<Box sx={sidebarWrapSx}>\n  <Sidebar width={SIDEBAR_WIDTH} />\n</Box>\n<Box>\n  <Nav />\n  <main>{children}</main>\n</Box>",
}, "Browser가 HTML을 받은 뒤 Client Component hydration 완료 시점");

// STEP 02
sectionSlide(2, SEQUENCE_12[1].title, SEQUENCE_12[1].desc, SEQUENCE_12[1].actor);
contentSlide("Step 02 — fetchSidebarRequest dispatch", [
  "useDispatch()로 Redux store에 액션 전달",
  "useEffect([], [dispatch]) → 마운트 후 1회만 실행",
  "컴포넌트는 API를 직접 호출하지 않음 (관심사 분리)",
  "액션 타입: sidebar/fetchSidebarRequest",
], {
  label: "Sidebar.tsx",
  text:
    "const dispatch = useDispatch();\n\nReact.useEffect(() => {\n  dispatch(fetchSidebarRequest());\n}, [dispatch]);",
}, "Strict Mode에서 dev 환경은 effect 2회 실행될 수 있음 → takeLatest가 처리");

// STEP 03
sectionSlide(3, SEQUENCE_12[2].title, SEQUENCE_12[2].desc, SEQUENCE_12[2].actor);
contentSlide("Step 03 — Slice reducer + takeLatest", [
  "① reducer: loading=true, error=null → 스피너 표시",
  "② saga middleware가 action.type 감지",
  "③ takeLatest(fetchSidebarRequest, fetchSidebarSaga) worker 시작",
  "이전 worker가 실행 중이면 cancel 후 새 worker만 유지",
], {
  label: "SidebarSlice.ts + SidebarSaga.ts",
  text:
    "// reducer\nfetchSidebarRequest(state) {\n  state.loading = true;\n  state.error = null;\n}\n\n// watcher\nyield takeLatest(\n  fetchSidebarRequest.type,\n  fetchSidebarSaga\n);",
});

// STEP 04
sectionSlide(4, SEQUENCE_12[3].title, SEQUENCE_12[3].desc, SEQUENCE_12[3].actor);
contentSlide("Step 04 — yield call(fetchSidebarApi)", [
  "function* fetchSidebarSaga() 제너레이터 실행",
  "yield call(fn) = saga middleware가 fn() Promise를 실행",
  "resolve 값이 items 변수에 할당됨",
  "try/catch → 실패 시 fetchSidebarFailure dispatch",
], {
  label: "SidebarSaga.ts",
  text:
    "function* fetchSidebarSaga() {\n  try {\n    const items: SidebarItem[] =\n      yield call(fetchSidebarApi);\n    yield put(fetchSidebarSuccess(items));\n  } catch {\n    yield put(\n      fetchSidebarFailure(\n        \"사이드바 로드 실패\"));\n  }\n}",
}, "yield ≠ await. saga middleware가 next()로 재개");

// STEP 05
sectionSlide(5, SEQUENCE_12[4].title, SEQUENCE_12[4].desc, SEQUENCE_12[4].actor);
contentSlide("Step 05 — Axios GET /api/menus", [
  "fetchSidebarApi() async 함수 실행",
  "api.get('/api/menus') → baseURL + path 조합",
  "실제 URL: http://localhost:8081/api/menus",
  "브라우저 → 백엔드 직접 요청 (Next.js proxy 없음) → CORS 필요",
], {
  label: "SidebarApi.ts + Axios.ts",
  text:
    "export const api = axios.create({\n  baseURL: process.env\n    .NEXT_PUBLIC_API_URL\n    ?? \"http://localhost:8081\",\n});\n\nexport async function fetchSidebarApi() {\n  const response = await api.get(\n    \"/api/menus\");\n  return response.data;\n}",
});

contentSlide("Step 05-B — HTTP 요청 상세", [
  "Method: GET  |  Accept: application/json",
  "Origin: http://localhost:3000 (cross-origin)",
  "성공: 200 + JSON 배열  |  실패: saga catch → error state",
  "SidebarItem 타입 = MenuNodeDto JSON 구조와 동일",
], {
  label: "SidebarTypes.ts",
  text:
    "export type SidebarItem = {\n  id: number;\n  code: string;\n  name: string;\n  path: string | null;\n  icon: string | null;\n  children: SidebarItem[];\n};",
});

// STEP 06
sectionSlide(6, SEQUENCE_12[5].title, SEQUENCE_12[5].desc, SEQUENCE_12[5].actor);
contentSlide("Step 06 — MenuController.getMenus()", [
  "@RestController + @RequestMapping('/api/menus')",
  "@GetMapping → GET 요청 처리",
  "menuService.getMenuTree() 결과를 JSON으로 직렬화",
  "@CrossOrigin + WebConfig: localhost:3000 허용",
], {
  label: "MenuController.java",
  text:
    "@RestController\n@RequestMapping(\"/api/menus\")\n@CrossOrigin(originPatterns = {\n  \"http://localhost:3000\",\n  \"http://127.0.0.1:3000\"\n})\npublic class MenuController {\n  @GetMapping\n  public List<MenuNodeDto> getMenus() {\n    return menuService.getMenuTree();\n  }\n}",
});

contentSlide("Step 06-B — Spring Boot 진입점", [
  "HospitalApplication.main() → port 8081",
  "@MapperScan('com.hospital.menu') → MenuMapper 등록",
  "WebConfig CorsFilter + addCorsMappings 이중 CORS",
  "application.yml: Oracle datasource + MyBatis mapper 경로",
], {
  label: "HospitalApplication.java + application.yml",
  text:
    "@SpringBootApplication\n@MapperScan(\"com.hospital.menu\")\npublic class HospitalApplication { ... }\n\nserver:\n  port: 8081\nspring:\n  datasource:\n    url: jdbc:oracle:thin:@...\nmybatis:\n  mapper-locations: classpath:mapper/*.xml",
});

// STEP 07
sectionSlide(7, SEQUENCE_12[6].title, SEQUENCE_12[6].desc, SEQUENCE_12[6].actor);
contentSlide("Step 07 — MyBatis SQL 실행", [
  "MenuService.getMenuTree() → menuMapper.selectAllMenus()",
  "MenuMapper.xml의 SELECT가 Oracle에 전달",
  "CMH.AUTH_MENU WHERE IS_ACTIVE='Y' ORDER BY SORT_ORDER",
  "resultType=com.hospital.menu.Menu",
], {
  label: "MenuMapper.xml",
  text:
    "<select id=\"selectAllMenus\"\n  resultType=\"com.hospital.menu.Menu\">\n  SELECT\n    MENU_ID    AS id,\n    PARENT_ID  AS parentId,\n    CODE, NAME, PATH, ICON,\n    SORT_ORDER AS sortOrder\n  FROM CMH.AUTH_MENU\n  WHERE IS_ACTIVE = 'Y'\n  ORDER BY SORT_ORDER\n</select>",
});

// STEP 08
sectionSlide(8, SEQUENCE_12[7].title, SEQUENCE_12[7].desc, SEQUENCE_12[7].actor);
contentSlide("Step 08 — DB → List<Menu> 평면 목록", [
  "Oracle이 row 집합 반환 → MyBatis가 Menu 객체 리스트로 매핑",
  "아직 트리 아님 — parentId/sortOrder 포함 평면 구조",
  "예: [{id:1,parentId:null}, {id:2,parentId:1}, ...]",
  "map-underscore-to-camel-case: MENU_ID → id",
], {
  label: "Menu.java (엔티티)",
  text:
    "public class Menu {\n  private Long id;\n  private String code;\n  private String name;\n  private String path;\n  private String icon;\n  private Long parentId;   // 트리용\n  private Integer sortOrder;\n}",
}, "Step 09 buildTree()의 입력 데이터");

// STEP 09
sectionSlide(9, SEQUENCE_12[8].title, SEQUENCE_12[8].desc, SEQUENCE_12[8].actor);
contentSlide("Step 09 — buildTree() 계층 변환", [
  "buildTree(flatList, null) → parentId==null인 루트부터 시작",
  "각 menu에 대해 children = buildTree(flatList, menu.id) 재귀",
  "sortOrder로 형제 노드 정렬",
  "toDto() → MenuNodeDto (parentId/sortOrder 제외)",
], {
  label: "MenuService.java",
  text:
    "public List<MenuNodeDto> getMenuTree() {\n  return buildTree(\n    menuMapper.selectAllMenus(), null);\n}\n\nprivate List<MenuNodeDto> buildTree(\n    List<Menu> flat, Long parentId) {\n  return flat.stream()\n    .filter(m -> Objects.equals(\n      m.getParentId(), parentId))\n    .sorted(by sortOrder)\n    .map(m -> { node.setChildren(\n      buildTree(flat, m.getId()));\n      return node; })\n    .collect(...);\n}",
});

contentSlide("Step 09-B — JSON 응답 예시", [
  "루트 배열 → 각 노드 children[] 중첩",
  "leaf는 children: [] 빈 배열",
  "path=null → 그룹 메뉴 (펼침만, Link 없음)",
  "icon → 프론트 SidebarIcons 맵과 매핑",
], {
  label: "MenuNodeDto JSON 예시",
  text:
    "[{\n  \"id\": 2,\n  \"code\": \"PATIENT\",\n  \"name\": \"환자 관리\",\n  \"path\": null,\n  \"icon\": \"People\",\n  \"children\": [{\n    \"id\": 3,\n    \"name\": \"환자 목록\",\n    \"path\": \"/patients\",\n    \"children\": []\n  }]\n}]",
});

// STEP 10
sectionSlide(10, SEQUENCE_12[9].title, SEQUENCE_12[9].desc, SEQUENCE_12[9].actor);
contentSlide("Step 10 — Spring JSON HTTP 200", [
  "Spring MVC가 List<MenuNodeDto> → application/json 직렬화",
  "HTTP/1.1 200 OK + body: JSON 배열",
  "Axios가 response 객체 { data, status, headers } 생성",
  "CORS 응답 헤더 포함 (Access-Control-Allow-Origin)",
], {
  label: "응답 구조",
  text:
    "HTTP/1.1 200 OK\nContent-Type: application/json\n\n[{ id, code, name, path,\n   icon, children: [...] }]\n\n// Axios 내부\nresponse.status === 200\nresponse.data === JSON 파싱 결과",
});

// STEP 11
sectionSlide(11, SEQUENCE_12[10].title, SEQUENCE_12[10].desc, SEQUENCE_12[10].actor);
contentSlide("Step 11 — response.data → Saga items", [
  "fetchSidebarApi() return response.data → SidebarItem[]",
  "yield call() resolve → const items = [...]",
  "saga는 .data 접근 불필요 — API 레이어가 unwrap 완료",
  "타입: Promise<SidebarItem[]>",
], {
  label: "SidebarApi.ts (return 지점)",
  text:
    "export async function fetchSidebarApi()\n  : Promise<SidebarItem[]> {\n  const response =\n    await api.get<SidebarItem[]>(\n      \"/api/menus\");\n  return response.data;\n  // ↑ saga의 items\n}\n\n// saga\nconst items = yield call(fetchSidebarApi);",
}, "Axios response 전체가 아니라 return 값만 saga에 전달");

// STEP 12
sectionSlide(12, SEQUENCE_12[11].title, SEQUENCE_12[11].desc, SEQUENCE_12[11].actor);
contentSlide("Step 12-A — put(fetchSidebarSuccess)", [
  "yield put() → Redux dispatch fetchSidebarSuccess(items)",
  "reducer: loading=false, items=action.payload",
  "useSelector 구독 컴포넌트 자동 재렌더",
], {
  label: "SidebarSlice.ts",
  text:
    "fetchSidebarSuccess(state, action) {\n  state.loading = false;\n  state.items = action.payload;\n}\n\nfetchSidebarFailure(state, action) {\n  state.loading = false;\n  state.error = action.payload;\n}",
});

contentSlide("Step 12-B — Sidebar UI 렌더링", [
  "loading → CircularProgress / error → Typography",
  "items.map → SidebarItem 재귀 (Link / Collapse)",
  "SidebarUtils.getOpenIds → 현재 pathname 부모 자동 펼침",
  "Browser에 최종 메뉴 목록 표시 완료",
], {
  label: "Sidebar.tsx + SidebarItem.tsx",
  text:
    "{items.map(item => (\n  <SidebarItem\n    key={item.id}\n    item={item}\n    pathname={pathname}\n    openIds={openIds}\n  />\n))}\n\n// leaf\n<ListItemButton\n  component={Link}\n  href={item.path} />",
});

contentSlide("Step 12-C — SidebarItem / SidebarUtils", [
  "depth 0 + icon → sidebarIconMap MUI 아이콘",
  "hasChildren → Collapse + ExpandLess/More 토글",
  "isItemActive / hasActiveChild → 선택·그룹 하이라이트",
  "getOpenIds(pathname, items) → openIds state 갱신",
], {
  label: "SidebarUtils.ts",
  text:
    "export function getOpenIds(\n  pathname: string,\n  items: SidebarItem[]\n): number[] {\n  for (const item of items) {\n    if (item.children?.length\n        && hasActiveChild(pathname, item)) {\n      openIds.push(item.id);\n    }\n    openIds.push(...getOpenIds(\n      pathname, item.children));\n  }\n  return openIds;\n}",
});

// ═══════════════════════════════════════
// APPENDIX
// ═══════════════════════════════════════

tableSlide("타입 / 데이터 매핑", ["레이어", "타입", "비고"], [
  ["Oracle DB", "AUTH_MENU 컬럼", "MENU_ID, PARENT_ID..."],
  ["MyBatis", "Menu", "parentId, sortOrder 포함"],
  ["Service/API", "MenuNodeDto", "children[], 트리 구조"],
  ["Axios/Redux", "SidebarItem[]", "response.data → items"],
], [2.2, 2.8, 4], null);

tableSlide("트러블슈팅", ["증상", "원인", "확인"], [
  ["사이드바 로드 실패", "8081 미실행", "Spring Boot 기동"],
  ["CORS 에러", "origin 불일치", "WebConfig / @CrossOrigin"],
  ["빈 메뉴", "DB row 없음", "IS_ACTIVE='Y'"],
  ["Network Error", "Oracle 다운", "application.yml"],
  ["로딩 무한", "saga 미등록", "run(rootSaga)"],
], [2.5, 3, 3.5], null);

contentSlide("12단계 한 줄 요약", [
  "01 Sidebar 마운트 → 02 dispatch → 03 takeLatest+loading",
  "04 yield call → 05 GET /api/menus → 06 Controller",
  "07 SQL → 08 평면 Menu → 09 buildTree → 10 JSON",
  "11 response.data → 12 put success → UI 렌더",
], {
  label: "핵심 파일 14개",
  text:
    "FE: Sidebar.tsx, SidebarSaga.ts,\n  SidebarSlice.ts, SidebarApi.ts,\n  Store.ts, Axios.ts\nBE: MenuController.java,\n  MenuService.java, MenuMapper.xml,\n  Menu.java, MenuNodeDto.java,\n  WebConfig.java, application.yml",
});

const closing = pptx.addSlide();
closing.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.title }, line: { color: C.title } });
closing.addText("감사합니다", { x: 0.6, y: 2.2, w: 8.8, h: 1, fontSize: 40, bold: true, color: "FFFFFF", align: "center", fontFace: FONT });
closing.addText("sidebar-data-flow.md  ·  sidebar-data-flow.pptx  ·  12 Steps", {
  x: 0.6, y: 3.5, w: 8.8, h: 0.5, fontSize: 12, color: "93C5FD", align: "center", fontFace: FONT,
});

await pptx.writeFile({ fileName: OUT });
console.log(`Created: ${OUT}`);
console.log(`Slides: intro + prep + 12 steps (section+detail) + appendix`);
