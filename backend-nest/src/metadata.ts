/* eslint-disable */
export default async () => {
    const t = {
        ["./model.dto"]: await import("./model.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./model.dto"), { "PostDto": { id: { required: true, type: () => String }, title: { required: true, type: () => String }, content: { required: true, type: () => String } }, "PostsListingDto": { data: { required: true, type: () => [t["./model.dto"].PostDto] }, nextPage: { required: true, type: () => Number, nullable: true } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": { type: String } } }]] } };
};