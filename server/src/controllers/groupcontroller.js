import {
    createGroup,
    getGroups,
    getGroupById,
    addMember,
    getMembers,
    removeMember
} from "../services/groupservice.js";

/**
 * Create Group
 */
export const create = async (req, res) => {

    try {

        const group = await createGroup(req.user._id, req.body);

        res.status(201).json({
            success: true,
            message: "Group created successfully",
            group
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get My Groups
 */
export const getAll = async (req, res) => {

    try {

        const groups = await getGroups(req.user._id);

        res.status(200).json({
            success: true,
            count: groups.length,
            groups
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/**
 * Get Group By Id
 */
export const getOne = async (req, res) => {

    try {

        const group = await getGroupById(
            req.params.id,
            req.user._id
        );

        res.status(200).json({
            success: true,
            group
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

export const addGroupMember = async (req, res) => {

    try {

        const group = await addMember(
            req.params.groupId,
            req.user._id,
            req.body.email
        );

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            group
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

export const getGroupMembers = async (req, res) => {

    try {

        const members = await getMembers(
            req.params.groupId,
            req.user._id
        );

        res.json({
            success: true,
            count: members.length,
            members
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

export const removeGroupMember = async (req, res) => {

    try {

        const group = await removeMember(
            req.params.groupId,
            req.user._id,
            req.params.memberId
        );

        res.json({
            success: true,
            message: "Member removed",
            group
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};