import Group from "../models/group.js";
import User from "../models/user.js";

/**
 * Create a new group
 */
export const createGroup = async (userId, groupData) => {
    const { name, description } = groupData;

    // Check if user already has a group with same name
    const existingGroup = await Group.findOne({
        name,
        createdBy: userId
    });

    if (existingGroup) {
        throw new Error("Group with this name already exists.");
    }

    const group = await Group.create({
        name,
        description,
        createdBy: userId,
        members: [userId]
    });

    return group;
};

/**
 * Get all groups of logged in user
 */
export const getGroups = async (userId) => {

    const groups = await Group.find({
        members: userId
    })
    .populate("createdBy", "name email")
    .populate("members", "name email");

    return groups;
};

/**
 * Get single group
 */
export const getGroupById = async (groupId, userId) => {

    const group = await Group.findOne({
        _id: groupId,
        members: userId
    })
    .populate("createdBy", "name email")
    .populate("members", "name email");

    if (!group) {
        throw new Error("Group not found");
    }

    return group;
};

export const addMember = async (groupId, currentUserId, email) => {

    // Find group
    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error("Group not found");
    }

    // Only creator can add members
    if (group.createdBy.toString() !== currentUserId.toString()) {
        throw new Error("Only group admin can add members");
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    // Check duplicate member
    const alreadyMember = group.members.some(
        member => member.toString() === user._id.toString()
    );

    if (alreadyMember) {
        throw new Error("User already exists in group");
    }

    group.members.push(user._id);

    await group.save();

    return await group.populate("members", "name email");
};

export const getMembers = async (groupId, userId) => {

    const group = await Group.findOne({
        _id: groupId,
        members: userId
    }).populate("members", "name email");

    if (!group) {
        throw new Error("Group not found");
    }

    return group.members;
};

export const removeMember = async (
    groupId,
    currentUserId,
    memberId
) => {

    const group = await Group.findById(groupId);

    if (!group) {
        throw new Error("Group not found");
    }

    if (group.createdBy.toString() !== currentUserId.toString()) {
        throw new Error("Only admin can remove members");
    }

    if (group.createdBy.toString() === memberId) {
        throw new Error("Cannot remove group creator");
    }

    group.members = group.members.filter(
        member => member.toString() !== memberId
    );

    await group.save();

    return group;
};