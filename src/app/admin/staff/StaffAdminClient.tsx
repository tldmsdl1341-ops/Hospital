"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  createStaffApi,
  fetchDepartmentsApi,
  fetchStaffListApi,
  type DepartmentOption,
  type StaffCreatePayload,
  type StaffListItem,
} from "@/lib/api/staffAdminApi";
import { resolveStorageUrl } from "@/lib/file/resolveStorageUrl";

type SearchType = "name" | "staff_id" | "department" | "position";

type RegisterForm = {
  staffId: string;
  password: string;
  staffName: string;
  staffType: string;
  staffRoleCode: string;
  staffDepartmentId: string;
  staffRankCode: string;
  staffPositionCode: string;
  staffPhone: string;
  staffExtensionNo: string;
  staffEmail: string;
  staffBirthDate: string;
  staffLicenseNo: string;
  zipCode: string;
  address: string;
  addressDetail: string;
};

const INITIAL_FORM: RegisterForm = {
  staffId: "",
  password: "",
  staffName: "",
  staffType: "ADM",
  staffRoleCode: "ROLE_ADMIN",
  staffDepartmentId: "",
  staffRankCode: "STAFF",
  staffPositionCode: "",
  staffPhone: "",
  staffExtensionNo: "",
  staffEmail: "",
  staffBirthDate: "",
  staffLicenseNo: "",
  zipCode: "",
  address: "",
  addressDetail: "",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "재직",
  LEAVE: "휴직",
  RETIRED: "퇴직",
};

export default function StaffAdminClient() {
  const [rows, setRows] = useState<StaffListItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [keyword, setKeyword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = useCallback(async (nextSearchType = searchType, nextKeyword = keyword) => {
    setLoading(true);
    setError(null);
    try {
      const [staffRows, deptRows] = await Promise.all([
        fetchStaffListApi({
          searchType: nextSearchType,
          keyword: nextKeyword.trim() || undefined,
        }),
        fetchDepartmentsApi(),
      ]);
      setRows(staffRows);
      setDepartments(deptRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터 조회에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [keyword, searchType]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!selectedPhoto) {
      setPhotoPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedPhoto);
    setPhotoPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  const handleSearch = () => {
    void loadData(searchType, keyword);
  };

  const handleOpenDialog = () => {
    setForm(INITIAL_FORM);
    setSelectedPhoto(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (submitting) return;
    setDialogOpen(false);
    setSelectedPhoto(null);
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("JPG, PNG 이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("사진 크기는 최대 5MB까지 가능합니다.");
      return;
    }

    setError(null);
    setSelectedPhoto(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const payload: StaffCreatePayload = {
        staffId: form.staffId.trim(),
        password: form.password,
        staffName: form.staffName.trim(),
        staffType: form.staffType,
        staffRoleCode: form.staffRoleCode,
        staffDepartmentId: form.staffDepartmentId,
        staffRankCode: form.staffRankCode,
        staffPositionCode: form.staffPositionCode || null,
        staffPhone: form.staffPhone.trim(),
        staffExtensionNo: form.staffExtensionNo.trim() || null,
        staffEmail: form.staffEmail.trim() || null,
        staffBirthDate: form.staffBirthDate,
        staffLicenseNo: form.staffLicenseNo.trim() || null,
      };

      await createStaffApi(payload, selectedPhoto);
      setDialogOpen(false);
      setSelectedPhoto(null);
      setForm(INITIAL_FORM);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "직원 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const departmentOptions = useMemo(
    () =>
      departments.map((dept) => (
        <MenuItem key={dept.departmentId} value={dept.departmentId}>
          {dept.departmentName}
        </MenuItem>
      )),
    [departments],
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight={700}>
            계정관리
          </Typography>
          <Typography variant="body2" color="text.secondary">
            직원 계정을 등록하고 사진은 등록 완료 시 SeaweedFS에 저장됩니다.
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleOpenDialog}>
          + 직원 등록
        </Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Stack direction="row" spacing={1.5} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="search-type-label">검색</InputLabel>
          <Select
            labelId="search-type-label"
            label="검색"
            value={searchType}
            onChange={(event) => setSearchType(event.target.value as SearchType)}
          >
            <MenuItem value="name">이름</MenuItem>
            <MenuItem value="staff_id">사번</MenuItem>
            <MenuItem value="department">부서</MenuItem>
            <MenuItem value="position">직급</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="검색어 입력"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
          sx={{ minWidth: 280 }}
        />
        <Button variant="outlined" onClick={handleSearch}>
          검색
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ bgcolor: "background.paper", borderRadius: 2, overflow: "hidden" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={72}>사진</TableCell>
                <TableCell>사번</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>부서</TableCell>
                <TableCell>직급</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>내선번호</TableCell>
                <TableCell>상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    표시할 직원이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.staffId} hover>
                    <TableCell>
                      <Avatar
                        src={resolveStorageUrl(row.photoUrl || row.photoKey) || undefined}
                        sx={{ width: 40, height: 40 }}
                      >
                        <PersonOutlineIcon fontSize="small" />
                      </Avatar>
                    </TableCell>
                    <TableCell>{row.staffId}</TableCell>
                    <TableCell>{row.staffName}</TableCell>
                    <TableCell>{row.departmentName || "-"}</TableCell>
                    <TableCell>{row.staffRankCode || "-"}</TableCell>
                    <TableCell>{row.staffPhone || "-"}</TableCell>
                    <TableCell>{row.staffExtensionNo || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={STATUS_LABEL[row.staffStatus] ?? row.staffStatus}
                        color={row.staffStatus === "ACTIVE" ? "success" : "default"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>신규 직원 등록</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack alignItems="center" spacing={1.5}>
                <Avatar
                  src={photoPreviewUrl || undefined}
                  sx={{ width: 120, height: 120, bgcolor: "#ece8ff", color: "#5b49c8" }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 56 }} />
                </Avatar>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handlePhotoSelect}
                />
                <Button variant="outlined" onClick={() => fileInputRef.current?.click()}>
                  사진 업로드
                </Button>
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  권장 크기 300x300px / JPG, PNG 파일 (최대 5MB)
                  <br />
                  등록 완료 시 SeaweedFS에 저장됩니다.
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                <Typography fontWeight={700}>기본 정보</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="사번"
                      fullWidth
                      required
                      value={form.staffId}
                      onChange={(event) => setForm({ ...form, staffId: event.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="비밀번호"
                      type="password"
                      fullWidth
                      required
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel id="dept-label">소속 부서</InputLabel>
                      <Select
                        labelId="dept-label"
                        label="소속 부서"
                        value={form.staffDepartmentId}
                        onChange={(event) =>
                          setForm({ ...form, staffDepartmentId: event.target.value })
                        }
                      >
                        {departmentOptions}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="이름"
                      fullWidth
                      required
                      value={form.staffName}
                      onChange={(event) => setForm({ ...form, staffName: event.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="생년월일"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={form.staffBirthDate}
                      onChange={(event) =>
                        setForm({ ...form, staffBirthDate: event.target.value })
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="이메일"
                      fullWidth
                      value={form.staffEmail}
                      onChange={(event) => setForm({ ...form, staffEmail: event.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="휴대폰번호"
                      fullWidth
                      required
                      value={form.staffPhone}
                      onChange={(event) => setForm({ ...form, staffPhone: event.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="면허번호"
                      fullWidth
                      value={form.staffLicenseNo}
                      onChange={(event) =>
                        setForm({ ...form, staffLicenseNo: event.target.value })
                      }
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "등록 중..." : "등록 완료"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
