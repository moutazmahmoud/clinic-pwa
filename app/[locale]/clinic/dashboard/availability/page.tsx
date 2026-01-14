"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "@/i18n/navigation";
import { Clinic, ClinicSchedule, UnavailableSlot } from "@/types";
import { useDashboard } from "@/components/layout/DashboardContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Calendar, Clock, Lock, Trash2, Plus, Save, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const DAYS_OF_WEEK = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function AvailabilityPage() {
    const router = useRouter();
    const { setTitle } = useDashboard();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [schedules, setSchedules] = useState<ClinicSchedule[]>([]);
    const [unavailableSlots, setUnavailableSlots] = useState<UnavailableSlot[]>([]);

    // Form state for new blocked slot
    const [newBlockedSlot, setNewBlockedSlot] = useState({
        date: "",
        start_time: "",
        end_time: "",
        reason: ""
    });

    useEffect(() => {
        setTitle("Availability Management");
        fetchData();
    }, [setTitle]);

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Get clinic
            const { data: clinicData, error: clinicError } = await supabase
                .from("clinics")
                .select("*")
                .eq("email", user.email!)
                .single();

            if (clinicError || !clinicData) {
                router.push("/");
                return;
            }

            setClinic(clinicData as Clinic);

            // Get schedules
            const { data: scheduleData } = await supabase
                .from("clinic_schedules")
                .select("*")
                .eq("clinic_id", clinicData.id)
                .order("day_of_week", { ascending: true });

            // Initialize default schedules if empty
            if (!scheduleData || scheduleData.length === 0) {
                const defaultSchedules = DAYS_OF_WEEK.map((_, index) => ({
                    clinic_id: clinicData.id,
                    day_of_week: index,
                    start_time: "09:00",
                    end_time: "17:00",
                    is_active: index >= 1 && index <= 5 // Mon-Fri default
                } as ClinicSchedule));
                setSchedules(defaultSchedules);
            } else {
                // Merge with defaults to ensure all days are present
                const fullSchedules = DAYS_OF_WEEK.map((_, index) => {
                    const existing = scheduleData.find(s => s.day_of_week === index);
                    return existing || {
                        clinic_id: clinicData.id,
                        day_of_week: index,
                        start_time: "09:00",
                        end_time: "17:00",
                        is_active: false
                    };
                });
                setSchedules(fullSchedules as ClinicSchedule[]);
            }

            // Get unavailable slots
            const { data: blockedData } = await supabase
                .from("unavailable_slots")
                .select("*")
                .eq("clinic_id", clinicData.id)
                .gte("date", new Date().toISOString().split('T')[0]) // Only future/today
                .order("date", { ascending: true });

            setUnavailableSlots((blockedData || []) as UnavailableSlot[]);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleSaveSchedule = async () => {
        setSaving(true);
        setMessage(null);

        try {
            // Upsert schedules
            const { error } = await supabase
                .from("clinic_schedules")
                .upsert(
                    schedules.map(s => ({
                        clinic_id: clinic!.id,
                        day_of_week: s.day_of_week,
                        start_time: s.start_time,
                        end_time: s.end_time,
                        is_active: s.is_active
                    })),
                    { onConflict: 'clinic_id,day_of_week' }
                );

            // Update slot duration
            await supabase
                .from("clinics")
                .update({ slot_duration_minutes: clinic?.slot_duration_minutes })
                .eq("id", clinic!.id);

            if (error) throw error;

            setMessage({ type: 'success', text: "Schedule updated successfully!" });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Failed to save schedule" });
        } finally {
            setSaving(false);
        }
    };

    const handleAddBlockedSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!newBlockedSlot.date || !newBlockedSlot.start_time || !newBlockedSlot.end_time) {
            setMessage({ type: 'error', text: "Please fill in all fields" });
            return;
        }

        try {
            const { data, error } = await supabase
                .from("unavailable_slots")
                .insert([{
                    clinic_id: clinic!.id,
                    ...newBlockedSlot
                }])
                .select()
                .single();

            if (error) throw error;

            setUnavailableSlots([...unavailableSlots, data as UnavailableSlot]);
            setNewBlockedSlot({ date: "", start_time: "", end_time: "", reason: "" });
            setMessage({ type: 'success', text: "Blocked slot added successfully" });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const handleDeleteBlockedSlot = async (id: string) => {
        try {
            const { error } = await supabase
                .from("unavailable_slots")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setUnavailableSlots(unavailableSlots.filter(s => s.id !== id));
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const toggleDay = (index: number) => {
        const newSchedules = [...schedules];
        newSchedules[index].is_active = !newSchedules[index].is_active;
        setSchedules(newSchedules);
    };

    const updateTime = (index: number, field: 'start_time' | 'end_time', value: string) => {
        const newSchedules = [...schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setSchedules(newSchedules);
    };

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                {/* Weekly Schedule Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Weekly Schedule
                                </h2>
                                <p className="text-sm text-gray-500">Set your regular working hours</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Slot Duration (mins):</label>
                                <input
                                    type="number"
                                    className="w-20 rounded-lg border-gray-300 text-sm"
                                    value={clinic?.slot_duration_minutes || 30}
                                    onChange={(e) => setClinic({ ...clinic!, slot_duration_minutes: parseInt(e.target.value) })}
                                    min="5" step="5"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {schedules.map((schedule, index) => (
                                <div key={index} className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${schedule.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-transparent'
                                    }`}>
                                    <div className="w-32 flex-shrink-0">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={schedule.is_active}
                                                onChange={() => toggleDay(index)}
                                                className="w-5 h-5 rounded text-primary focus:ring-primary"
                                            />
                                            <span className={`font-medium ${schedule.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {DAYS_OF_WEEK[index]}
                                            </span>
                                        </label>
                                    </div>

                                    {schedule.is_active ? (
                                        <div className="flex items-center gap-2 flex-1">
                                            <input
                                                type="time"
                                                value={schedule.start_time}
                                                onChange={(e) => updateTime(index, 'start_time', e.target.value)}
                                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input
                                                type="time"
                                                value={schedule.end_time}
                                                onChange={(e) => updateTime(index, 'end_time', e.target.value)}
                                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex-1 text-sm text-gray-400 italic">
                                            Closed
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <Button
                                onClick={handleSaveSchedule}
                                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        Save Schedule
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Blocked Slots Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1">
                            <Lock className="h-5 w-5 text-red-500" />
                            Block Time Off
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">Add exceptions to your schedule</p>

                        <form onSubmit={handleAddBlockedSlot} className="space-y-4 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                    value={newBlockedSlot.date}
                                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Start</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        value={newBlockedSlot.start_time}
                                        onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, start_time: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">End</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                        value={newBlockedSlot.end_time}
                                        onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, end_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Reason (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                                    placeholder="e.g. Doctor appointment, Lunch"
                                    value={newBlockedSlot.reason}
                                    onChange={(e) => setNewBlockedSlot({ ...newBlockedSlot, reason: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100">
                                <Plus className="h-4 w-4 mr-2" />
                                Block Time
                            </Button>
                        </form>

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upcoming Blocked Slots</h3>
                            {unavailableSlots.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No blocked slots.</p>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {unavailableSlots.map((slot) => (
                                        <div key={slot.id} className="group flex items-start justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-100 transition-colors">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {format(new Date(slot.date), 'MMM d, yyyy')}
                                                </p>
                                                <p className="text-xs text-gray-600 font-medium">
                                                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                                </p>
                                                {slot.reason && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{slot.reason}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteBlockedSlot(slot.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove blocked slot"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
