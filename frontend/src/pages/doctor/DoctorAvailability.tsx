import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Clock, Save, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { DoctorAvailability } from '../../types';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const DoctorAvailabilityPage: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<DoctorAvailability[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const docRes = await api.get('/doctors/me');
      const doc = docRes.data.data;
      if (doc) {
        setDoctorId(doc.id);
        const availRes = await api.get(`/doctors/${doc.id}/availability`);
        setAvailabilities(availRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSlot = (day: string) => {
    if (availabilities.some((a) => a.dayOfWeek === day)) return;
    setAvailabilities([
      ...availabilities,
      { dayOfWeek: day, startTime: '09:00', endTime: '17:00', maxPatients: 15, slotDurationMinutes: 30 }
    ]);
  };

  const handleRemoveSlot = (day: string) => {
    setAvailabilities(availabilities.filter((a) => a.dayOfWeek !== day));
  };

  const handleUpdateSlot = (day: string, field: keyof DoctorAvailability, value: any) => {
    setAvailabilities(
      availabilities.map((a) => (a.dayOfWeek === day ? { ...a, [field]: value } : a))
    );
  };

  const handleSaveSchedule = async () => {
    setMessage(null);
    try {
      await api.post('/doctors/availability', availabilities);
      setMessage('Weekly availability schedule saved successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to save schedule.');
    }
  };

  return (
    <Layout title="Weekly Availability & Schedule" subtitle="Configure your consultation days, working hours, and time slot durations">
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card" style={{ maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Consultation Weekly Timings</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>Select the days you are available for online patient appointments</p>
          </div>
          <button onClick={handleSaveSchedule} className="btn btn-primary">
            <Save size={16} /> Save Weekly Schedule
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {DAYS.map((day) => {
            const slot = availabilities.find((a) => a.dayOfWeek === day);
            const isAvailable = !!slot;

            return (
              <div
                key={day}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: isAvailable ? '#f0f9ff' : '#f8fafc',
                  border: isAvailable ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ width: '120px', fontWeight: 700, fontSize: '14px', color: isAvailable ? '#0369a1' : '#64748b' }}>
                  {day}
                </div>

                {isAvailable ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>Start:</label>
                      <input
                        type="time"
                        className="form-input"
                        style={{ width: '110px', padding: '6px 10px' }}
                        value={slot.startTime}
                        onChange={(e) => handleUpdateSlot(day, 'startTime', e.target.value)}
                      />

                      <label style={{ fontSize: '12px', color: '#64748b' }}>End:</label>
                      <input
                        type="time"
                        className="form-input"
                        style={{ width: '110px', padding: '6px 10px' }}
                        value={slot.endTime}
                        onChange={(e) => handleUpdateSlot(day, 'endTime', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>Max Patients:</label>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '70px', padding: '6px 10px' }}
                        value={slot.maxPatients}
                        onChange={(e) => handleUpdateSlot(day, 'maxPatients', Number(e.target.value))}
                      />
                    </div>

                    <button onClick={() => handleRemoveSlot(day)} className="btn btn-outline btn-sm" style={{ color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Unavailable</span>
                    <button onClick={() => handleAddSlot(day)} className="btn btn-outline btn-sm">
                      <Plus size={14} /> Add Timings
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
