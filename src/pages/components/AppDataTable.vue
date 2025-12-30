<script setup>
import { debounce } from "lodash";
import {
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
  useAttrs,
  useId,
} from "vue";
import setTableState from "@/plugins/setTableState";
import getTableState from "@/plugins/getTableState";
import { api } from "@/utils/axios";
import { useSettingStore } from "@/store/setting";

const settingStore = useSettingStore();

const selectedCampusId = ref(settingStore.campus_id);

watch(
  () => settingStore.campus_id,
  (campusId) => {
    selectedCampusId.value = campusId;
  },
  { immediate: true }
);

const props = defineProps({
  title: { type: String, default: "DataTable" },
  headers: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  meta: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false },
  isDelete: { type: [Boolean, Number], default: false },
  canDelete: { type: String, default: null },
  isEdit: { type: [Boolean, Number], default: false },
  canEdit: { type: String, default: null },
  isReceive: { type: [Boolean, Number], default: false },
  canReceive: { type: String, default: null },
  isView: { type: [Boolean, Number], default: false },
  canView: { type: String, default: null },
  isDisable: { type: [Boolean, Number], default: false },
  canDisable: { type: String, default: null },
  isDefault: { type: [Boolean, Number], default: false },
  canDefault: { type: String, default: null },
  isRollback: { type: [Boolean, Number], default: false },
  canRollback: { type: String, default: null },
  isPassword: { type: [Boolean, Number], default: false },
  canPassword: { type: String, default: null },
  hideHeader: { type: [Boolean, Number], default: false },
  hideFooter: { type: [Boolean, Number], default: false },
  limit: { type: Number, default: 8 },
  mobileViews: { type: Boolean, default: false },
  mobileWidth: { type: Number, default: 678 },
  isHover: { type: Boolean, default: true },
  isPagination: { type: Boolean, default: true },
  disableSort: { type: Boolean, default: true },
  isExcel: { type: Boolean, default: false },
  saveState: { type: Boolean, default: false },
  apiUrl: { type: String, default: null },
  apiData: { type: Object, default: () => ({}) },
  filters: { type: Object, default: () => ({}) },
  search: { type: String, default: null },
  transformData: {
    type: Function,
    required: false,
    default: null,
  },
  response: {
    type: Object,
    default: [],
  },
});

const internalLoading = ref(false);
const loading = computed(() => props.loading);
const isMobile = ref(window.innerWidth < props.mobileWidth);
const updateSize = () => {
  isMobile.value = window.innerWidth < props.mobileWidth;
};

const elementId = computed(() => {
  const attrs = useAttrs();
  const _elementIdToken = attrs.id;
  const _id = useId();

  return _elementIdToken ? `app-datatable-${_elementIdToken}` : _id;
});

// const options = computed(() => props.options);
const savedOptions = props.saveState ? getTableState(props.apiUrl) : null;
const options = ref(savedOptions || { page: 1, limit: props.limit });
// const filters = ref(savedOptions?.filter || { ...(props?.filters || []) });
const filters = ref({ ...(props?.filters || []) });
const search = ref(savedOptions?.search || props?.search || null);
const lastSelectedItem = ref(savedOptions?.lastSelectedItem || null);

const emit = defineEmits([
  "onDelete",
  "onView",
  "onReceive",
  "onEdit",
  "onDisable",
  "onPassword",
  "onPaginate",
  "onDefault",
  "onRollback",
  "update:loading",
  "update:filters",
  "update:search",
  "response",
]);

const saveSelectedItem = (item) => {
  if (props.apiUrl && props.saveState) {
    setTableState(
      props.apiUrl,
      {
        page: options.value.page,
        limit: options.value.limit,
        filter: filters?.value || [],
        lastSelectedItem: item,
      },
      30
    );
  }
};

const receiveCallback = debounce((item) => emit("onReceive", item), 500);
const viewCallback = debounce((item) => {
  saveSelectedItem(item.id);
  emit("onView", item);
}, 500);
const editCallback = debounce((item) => {
  saveSelectedItem(item.id);
  emit("onEdit", item);
}, 500);
const deleteCallback = debounce(async (item) => emit("onDelete", item), 500);
const lockCallback = debounce((item) => emit("onDisable", item), 500);
const passwordCallback = debounce((item) => emit("onPassword", item), 500);
const defaultCallback = debounce((item) => emit("onDefault", item), 500);
const rollbackCallback = debounce((item) => emit("onRollback", item), 500);

const dataItems = ref([]);

watch(
  () => props.loading,
  (newVal) => {
    if (newVal !== undefined) {
      internalLoading.value = newVal; // Respect external loading
    }
  }
);

const getButtonColor = (button, item) => {
  if (button.checkActive) return item.is_active ? "success" : "red";
  if (button.checkDefault) return item.default ? "success" : "red";
  return button.color;
};

const getButtonIcon = (button, item) => {
  if (button.checkIcon)
    return item.is_active ? button.firstIcon : button.secondIcon;
  return button.icon;
};

const calculateLength = (total, limit) => {
  if (!total || !limit) return 0;
  return Math.ceil(total / limit);
};

const initData = async (item) => {
  internalLoading.value = true;
  emit("update:loading", true);
  try {
    if (props.apiUrl != null) {
      const res = await api.post(
        `/${props.apiUrl}?page=${options.value.page}&per_page=${
          options.value.limit
        }&search=${filters.value.search || ""}&year=${
          filters.value.yearId || ""
        }&selectedCampusId=${selectedCampusId.value || ""}`
      );

      //   const res = await api.post(
      //     `/${props.apiUrl}?page=${options.value.page}&per_page=${
      //       options.value.limit
      //     }&filter=${filters.value || {}}`
      //   );

      console.log(res.data.data);

      // Apply the transformation if provided
      let items = res.data.data;

      //   console.log(res.data);

      // Apply the transformation if provided
      if (props.transformData) {
        items = props.transformData(items);
      }

      props.response = res.data;
      emit("update:response", res.data);

      dataItems.value = {
        data: items,
        links: {
          first_page_url: res.data.first_page_url,
          last_page_url: res.data.last_page_url,
          next_page_url: res.data.next_page_url,
          prev_page_url: res.data.prev_page_url,
        },
        meta: {
          current_page: res.data.current_page,
          from: res.data.from,
          last_page: res.data.last_page,
          links: res.data.links,
          path: res.data.path,
          per_page: res.data.per_page,
          to: res.data.to,
          total: res.data.total || 0,
        },
      };

      console.log(dataItems.value);
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    internalLoading.value = false;
    emit("update:loading", false);
  }
};

onMounted(() => {
  emit("update:filters", filters.value);
  initData();
  window.addEventListener("resize", updateSize);
});
onUnmounted(() => window.removeEventListener("resize", updateSize));

const actionButtons = [
  {
    title: "Rollback",
    value: "default",
    icon: "tabler-arrow-back-up",
    color: "secondary",
    permission: props?.canRollback,
    show: props?.isRollback,
    action: rollbackCallback,
  },
  {
    title: "Default",
    value: "default",
    icon: "tabler-circuit-capacitor",
    color: "secondary",
    permission: props?.canDefault,
    show: props?.isDefault,
    action: defaultCallback,
    checkDefault: true,
  },
  {
    title: "Disable",
    value: "disable",
    icon: "tabler-cancel",
    color: "secondary",
    permission: props?.canView,
    show: props?.isDisable,
    action: lockCallback,
    checkActive: true,
    checkIcon: true,
    firstIcon: "tabler-check",
    secondIcon: "tabler-cancel",
  },
  {
    title: "Password",
    value: "password",
    icon: "tabler-key",
    color: "secondary",
    permission: props?.canPassword,
    show: props?.isPassword,
    action: passwordCallback,
  },
  {
    title: "Receive",
    value: "receive",
    icon: "tabler-cash-banknote",
    color: "success",
    permission: props?.canReceive,
    show: props?.isReceive,
    action: receiveCallback,
  },
  {
    title: "View",
    value: "view",
    icon: "mdi-eye",
    color: "success",
    permission: props?.canView,
    show: props?.isView,
    action: viewCallback,
  },
  {
    title: "Edit",
    value: "edit",
    icon: "mdi-pencil",
    color: "warning",
    permission: props?.canEdit,
    show: props?.isEdit,
    action: editCallback,
  },
  {
    title: "Delete",
    value: "delete",
    icon: "mdi-account-remove",
    color: "red",
    permission: props?.canDelete,
    show: props?.isDelete,
    action: deleteCallback,
  },
];

const getTextColor = (button, item) =>
  button.color === "error" ? "#fff" : "inherit";
const getButtonBackgroundClass = (button, item) => `${button.color}-bg`;

const getValue = (item, key) => {
  const keys = key.split(".");
  let value = item;
  for (const k of keys) {
    value = value ? value[k] : null;
  }
  return value || "";
};

// Ref for the hidden table
const dataTableRef = ref(null);

const reload = debounce(() => initData(), 500);

defineExpose({
  reload,
});

watch(
  filters.value,
  debounce(() => {
    options.value.page = 1;
    initData();
    if (props.apiUrl && props.saveState) {
      setTableState(
        props.apiUrl,
        {
          page: options.value.page,
          limit: options.value.limit,
          filter: filters?.value || [],
          search: search?.value || null,
          selectedCampusId: selectedCampusId.value,
        },
        30
      );
    }
  }, 500)
);

watch(
  () => ({
    page: options.value.page,
    limit: options.value.limit,
    campusId: settingStore.campus_id,
  }),
  (newVal, oldVal) => {
    if (
      newVal.page !== oldVal.page ||
      newVal.limit !== oldVal.limit ||
      newVal.campusId !== oldVal.campusId
    ) {
      if (props.apiUrl && props.saveState) {
        setTableState(
          props.apiUrl,
          {
            page: options.value.page,
            limit: options.value.limit,
            filter: filters?.value || [],
            selectedCampusId: selectedCampusId.value,
          },
          30
        );
      }
      initData();
    }
  }
);
</script>

<template>
  <div class="table-wrapper">
    <VRow>
      <!-- {{ filters }} -->
      <VDataTableServer
        v-bind="{
          ...$attrs,
          class: null,
          label: undefined,
          id: elementId,
        }"
        :headers="headers"
        :items="dataItems?.data || []"
        :items-per-page="options.limit"
        :items-length="dataItems?.data?.length || 0"
        :page="options.page"
        :sort-by="options.sortBy"
        :sort-desc="options.sortDesc"
        :options="options"
        :hide-default-header="hideHeader"
        :hide-default-footer="hideFooter"
        :loading="internalLoading"
        :mobile="isMobile && mobileViews"
        :hover="isHover"
        :disable-sort="disableSort"
        class="text-no-wrap custom-header customFont"
        expand-on-click
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <template #item="{ item }">
          <tr
            class="v-data-table__tr v-data-table__tr--clickable"
            :class="{
              'highlight-row': item.id === lastSelectedItem,
            }"
          >
            <!-- Visible columns -->
            <template v-for="header in headers" :key="header.key">
              <td
                class="v-data-table__td"
                :class="
                  header.align
                    ? `v-data-table-column--align-${header.align}`
                    : 'v-data-table-column--align-start'
                "
              >
                <template v-if="`item.${header.key}` == `item.actions`">
                  <IconBtn>
                    <VIcon icon="tabler-dots-vertical" color="grey" />
                    <v-menu location="end">
                      <template #activator="{ props }">
                        <v-btn v-bind="props" flat size="sm">
                          <v-icon> mdi-dots-vertical </v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <template
                          v-for="(button, index) in actionButtons"
                          :key="index"
                        >
                          <VListItem v-if="button.show && !button.permission">
                            <v-btn
                              flat
                              icon
                              size="30"
                              :class="'text-' + button.color"
                              @click="() => button.action(item)"
                            >
                              <VIcon>{{ button.icon }}</VIcon>
                              <!-- <VIcon
                                :icon="getButtonIcon(button, item)"
                                style="margin-right: 6px"
                                
                              /> -->
                              <!-- <span style="font-size: 14px">{{
                                button.icon
                              }}</span> -->
                            </v-btn>
                          </VListItem>
                        </template>
                      </v-list>
                    </v-menu>
                  </IconBtn>
                </template>

                <slot v-else :name="`item.${header.key}`" :item="item">
                  {{
                    header.value
                      ? header.value(item)
                      : getValue(item, header.key)
                  }}
                </slot>
              </td>
            </template>
          </tr>
        </template>

        <template
          v-for="(slotName, index) in Object.keys($slots)"
          :key="index"
          v-slot:[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps"></slot>
        </template>

        <template #no-data>
          <div class="no-data-container text-center py-4">
            <VIcon
              icon="tabler-info-circle"
              size="48"
              color="warning"
              class="mb-2"
            />
            <p class="text-h6 text-medium-emphasis">No Records Found</p>
            <p class="text-body-2 text-disabled">
              Try adjusting your search or check back later.
            </p>
          </div>
        </template>

        <template #bottom>
          <div v-if="isPagination">
            <VDivider />
            <VCol>
              <VCardText style="padding: 0">
                <div
                  class="d-flex flex-wrap justify-center justify-sm-space-between gap-y-2 align-center"
                >
                  <VSelect
                    variant="outlined"
                    density="compact"
                    v-model="options.limit"
                    :items="[8, 25, 50, 100, 500, 10000, 999999]"
                    hide-details
                    style="
                      max-inline-size: 8rem;
                      min-inline-size: 5rem;
                      margin-right: 5px;
                    "
                  />

                  <div>
                    <span class="text-subtitle-2"
                      >Showing {{ dataItems?.meta?.from || 0 }} to
                      {{ dataItems?.meta?.to || 0 }} of
                      {{ dataItems?.meta?.total || 0 }} results</span
                    >
                  </div>
                  <!-- Add Export Button -->

                  <VPagination
                    v-model="options.page"
                    active-color="green-darken-4"
                    size="small"
                    :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                    :length="
                      calculateLength(
                        dataItems?.meta?.total || 0,
                        options.limit
                      )
                    "
                    @click.prevent
                  />
                </div>
              </VCardText>
            </VCol>
          </div>

          <slot name="footer"></slot>
        </template>
      </VDataTableServer>
    </VRow>
  </div>
</template>

<style scoped>
.highlight-row {
  background-color: #f3f3f3; /* light blue, adjust as needed */
  transition: background-color 0.3s ease;
}
</style>
