import { clientApi } from "@/baseApis/axiosBase";
import serializeNodesToString from "@/utils/editor/serializeNodesToString";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface CurrentUserProject {
	value: ProjectInterface;
	status:
		| "init"
		| "pending"
		| "fulfilled"
		| "rejected"
		| "updating"
		| "updated"
		| "updateFailed";
}

export interface GetCurrentUserProjectParams {
	projectId: any;
}
export interface DeleteCurrentUserProjectParams
	extends GetCurrentUserProjectParams {}

export interface UpdateUserProjectParams {
	projectId: string;
	projectBody: any;
}

export interface CreateUserProjectParams {
	project: {
		title: string;
		name: string;
		lang?: string;
		description?: string;
		outline: string[];
	};
}

export const getCurrentUserProject = createAsyncThunk(
	"currentUserArticle/getCurrentUserArticle",
	async ({ projectId }: GetCurrentUserProjectParams) => {
		const response = await clientApi.get(`/writing/project/${projectId}`);
		let newProject: ProjectInterface = response.data;
		// newProject.article_text = serializeNodesToString(
		// 	JSON.parse(newProject.article || "[{text:''}]")
		// );
		return newProject;
	}
);

export const createUserProject = createAsyncThunk(
	"currentUserArticle/createUserArticle",
	async ({ project }: CreateUserProjectParams) => {
		const response = await clientApi.post(`/writing/projects`, project);
		let newProject: ProjectInterface = response.data;
		// const qaRes = await clientApi.post(`qa/qa-boxes`, {
		// 	name: newProject.name,
		// 	project: newProject.id,
		// });
		// let projectQABox: QABoxInterface = qaRes.data;
		// newProject.qaBox = projectQABox.id;
		if (newProject?.article)
			newProject.article_text = serializeNodesToString(newProject.article);
		return newProject;
	}
);
export const updateUserProject = createAsyncThunk(
	"currentUserArticle/updateUserArticle",
	async ({ projectId, projectBody }: UpdateUserProjectParams) => {
		const response = await clientApi.patch(`/writing/project/${projectId}`, {
			article: projectBody,
			article_text: serializeNodesToString(projectBody),
		});
		let newProject: ProjectInterface = response.data;
		// newProject.article_text = serializeNodesToString(
		// 	JSON.parse(newProject.article || "[{text:''}]")
		// );
		return newProject;
	}
);

export const deleteCurrentUserProject = createAsyncThunk(
	"currentUserArticle/deleteCurrentUserArticle",
	async ({ projectId }: DeleteCurrentUserProjectParams) => {
		const response = await clientApi.delete(`/writing/project/${projectId}`);
		return {};
	}
);

const initialState = {
	value: {},
	status: "init",
} as CurrentUserProject;

const currentUserProject = createSlice({
	name: "currentUserArticle",
	initialState,
	reducers: {
		resetCurrentUserProject: (state, action) => {
			if (action.payload) {
				state.value = action.payload;
				return state;
			} else return initialState;
		},
	},
	extraReducers: (builder) => {
		// set current article
		builder.addCase(getCurrentUserProject.fulfilled, (state, action) => {
			state.status = "fulfilled";
			state.value = action.payload;
			return state;
		});
		builder.addCase(getCurrentUserProject.pending, (state, action) => {
			state.status = "pending";
			return state;
		});
		builder.addCase(getCurrentUserProject.rejected, (state, action) => {
			state.status = "rejected";
			return state;
		});
		// ///////////////////////////////////////////////////

		// create new Project and set it as a current Project
		builder.addCase(createUserProject.fulfilled, (state, action) => {
			state.status = "fulfilled";
			state.value = action.payload;
			// console.log(state.value);
			return state as CurrentUserProject;
		});
		builder.addCase(createUserProject.pending, (state, action) => {
			state.status = "pending";
			return state;
		});
		builder.addCase(createUserProject.rejected, (state, action) => {
			state.status = "rejected";
			return state;
		});
		// ///////////////////////////////////////////////////

		// save the current Project
		builder.addCase(updateUserProject.fulfilled, (state, action) => {
			state.status = "updated";
			state.value = action.payload;
			// console.log(state.value);
			return state;
		});
		builder.addCase(updateUserProject.pending, (state, action) => {
			state.status = "updating";
			return state;
		});
		builder.addCase(updateUserProject.rejected, (state, action) => {
			state.status = "updateFailed";
			return state;
		});
		// ///////////////////////////////////////////////////

		// Delete the current Project
		builder.addCase(deleteCurrentUserProject.fulfilled, (state, action) => {
			state.status = "fulfilled";
			return state;
		});
		builder.addCase(deleteCurrentUserProject.pending, (state, action) => {
			state.status = "pending";
			return state;
		});
		builder.addCase(deleteCurrentUserProject.rejected, (state, action) => {
			state.status = "rejected";
			return state;
		});
		// ///////////////////////////////////////////////////
	},
});
export const { resetCurrentUserProject } = currentUserProject.actions;
export default currentUserProject.reducer;
