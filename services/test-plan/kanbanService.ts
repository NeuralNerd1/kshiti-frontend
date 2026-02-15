import api from "../api";

export interface KanbanBoardConfig {
    id?: number;
    project: number;
    view_key: string;
    layout_type: "STANDARD" | "COMPACT";
    color_scheme: "MODERN" | "CLASSIC" | "HIGH_CONTRAST";
    card_density: "COMPACT" | "COMFORTABLE" | "SPACIOUS";
    swimlane_attribute: "NONE" | "OWNER" | "PRIORITY" | "SECTION";
    zoom_level: number;
    enable_glass: boolean;
    custom_accent_color: string;
    show_owner: boolean;
    show_due_date: boolean;
    columns_config: any;
}

export const kanbanService = {
    getConfig: async (projectId: number, viewKey: string = "GLOBAL"): Promise<KanbanBoardConfig> => {
        const response = await api.get(`/test-plan/projects/${projectId}/kanban-config/`, {
            params: { view_key: viewKey }
        });
        return response.data;
    },

    updateConfig: async (projectId: number, data: Partial<KanbanBoardConfig>): Promise<KanbanBoardConfig> => {
        // We update via PUT
        const updateResponse = await api.put(`/test-plan/projects/${projectId}/kanban-config/`, data);
        return updateResponse.data;
    },
};
