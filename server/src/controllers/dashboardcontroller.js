import getDashboard from "../services/dashboardservice.js";


export const getDashboardController = async (
    req,
    res
) => {

    try {

        const dashboard =
            await getDashboard({

                groupId:
                    req.params.groupId,

                userId:
                    req.user._id.toString()

            });


        res.status(200).json({

            success: true,

            dashboard

        });

    } catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};